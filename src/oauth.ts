import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { OAuth2Strategy } from 'passport-oauth';

// CONFIGURATION
const port = 8000;
const authorizationURL = 'https://accounts.google.com/o/oauth2/v2/auth';
const tokenURL = 'https://oauth2.googleapis.com/token';
const callbackURL = `http://localhost:${port}/callback`;
const clientID = process.env.GOOGLE_CLIENT_ID || 'your-client-id.apps.googleusercontent.com';
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || 'shhh-its-a-secret';

function runOAuthClient(): void {
  passport.use('provider', new OAuth2Strategy({
    authorizationURL,
    tokenURL,
    clientID,
    clientSecret,
    callbackURL
  }, function(accessToken, refreshToken, profile, done) {
      console.log(`Received OAuth token: ${accessToken}`);
      void refreshToken; // To avoid unused variable warning
      void profile; // To avoid unused variable warning
      // Here you would typically find or create a user in your database
      // For this example, we'll just return the profile
      done(null, profile);
    }
  ));
  
  const app = express();
  app.use(session({
    secret: clientSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
  
  app.get('/', (req, res) => {
    void req; // To avoid unused variable warning
    res.send(`<a href="/auth/provider">Log In with OAuth 2.0 Provider</a>`);
  });
  
  // Redirect the user to the OAuth 2.0 provider for authentication.  When
  // complete, the provider will redirect the user back to the application at
  //     /auth/provider/callback
  app.get('/auth/provider', passport.authenticate('provider', {
    scope: [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.acls.readonly',
      'https://www.googleapis.com/auth/calendar.calendarlist.readonly'
    ]
  }));
  
  // The OAuth 2.0 provider has redirected the user back to the application.
  // Finish the authentication process by attempting to obtain an access
  // token.  If authorization was granted, the user will be logged in.
  // Otherwise, authentication has failed.
  app.get('/callback',
    passport.authenticate('provider', { successRedirect: '/',
                                        failureRedirect: '/login' }));
  
  app.listen(port, () => {
    console.log(`OAuth client listening on port ${port}`);
  });
}


// ...
runOAuthClient();
