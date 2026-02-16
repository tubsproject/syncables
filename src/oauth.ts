import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { OAuth2Strategy } from 'passport-oauth';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function runOAuthClient(oauth2Config: any, port: number, cb: (token: string) => void): void {
  passport.use('provider', new OAuth2Strategy(oauth2Config,
    function(accessToken, refreshToken, profile, done) {
    //   console.log('Access Token:', accessToken);
    //   console.log('Refresh Token:', refreshToken);
    //   console.log('Profile:', profile);
      cb(accessToken);
      void refreshToken; // To avoid unused variable warning
      void profile; // To avoid unused variable warning
      // Here you would typically find or create a user in your database
      // For this example, we'll just return the profile
      done(null, profile);
    }
  ));
  
  const app = express();
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
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
    res.send(`Hello World! ${req.query.name || ''}, <a href="/auth/provider">Log In with OAuth 2.0 Provider</a>`);
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
