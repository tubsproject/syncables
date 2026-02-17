import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { OAuth2Strategy } from 'passport-oauth';

// CONFIGURATION
const port = 8000;
const configs = {
  'google-calendar': {
    authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenURL: 'https://oauth2.googleapis.com/token',
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${port}/callback`,
    scope: [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.acls.readonly',
      'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
    ],
  },
  moneybird: {
    authorizationURL: 'https://moneybird.com/oauth/authorize',
    tokenURL: 'https://moneybird.com/oauth/token',
    clientID: process.env.MONEYBIRD_CLIENT_ID,
    clientSecret: process.env.MONEYBIRD_CLIENT_SECRET,
    callbackURL: `http://localhost:${port}/callback`,
    scope: [
      'sales_invoices',
      'documents',
      'estimates',
      'bank',
      'time_entries',
      'settings',
    ],
  },
};

function runOAuthClient(apiName: string): void {
  if (
    typeof configs[apiName].clientID === 'undefined' ||
    typeof configs[apiName].clientSecret === 'undefined'
  ) {
    throw new Error(`Missing clientID or clientSecret for ${apiName}`);
  }
  passport.use(
    'provider',
    new OAuth2Strategy(configs[apiName], function (
      accessToken,
      refreshToken,
      profile,
      done,
    ) {
      console.log(`Received OAuth token: ${accessToken}`);
      void refreshToken; // To avoid unused variable warning
      void profile; // To avoid unused variable warning
      // Here you would typically find or create a user in your database
      // For this example, we'll just return the profile
      done(null, profile);
    }),
  );

  const app = express();
  app.use(
    session({
      secret: configs[apiName].clientSecret,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true },
    }),
  );
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  app.get('/', (req, res) => {
    void req; // To avoid unused variable warning
    res.send(`<a href="/auth/provider">Log in to ${apiName}</a>`);
  });

  // Redirect the user to the OAuth 2.0 provider for authentication.  When
  // complete, the provider will redirect the user back to the application at
  //     /auth/provider/callback
  app.get(
    '/auth/provider',
    passport.authenticate('provider', {
      scope: configs[apiName].scope,
    }),
  );

  // The OAuth 2.0 provider has redirected the user back to the application.
  // Finish the authentication process by attempting to obtain an access
  // token.  If authorization was granted, the user will be logged in.
  // Otherwise, authentication has failed.
  app.get(
    '/callback',
    passport.authenticate('provider', {
      successRedirect: '/',
      failureRedirect: '/login',
    }),
  );

  app.listen(port, () => {
    console.log(`OAuth client listening on port ${port}`);
  });
}

// ...
const apiName = process.argv[2];
if (!apiName) {
  console.error('Please provide an API name as a command-line argument');
  process.exit(1);
}
if (!configs[apiName]) {
  console.error(`Unsupported API name: ${apiName}`);
  process.exit(1);
}
runOAuthClient(apiName);
