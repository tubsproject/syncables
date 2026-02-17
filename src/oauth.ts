import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { OAuth2Strategy } from 'passport-oauth';
import { configs, port } from './configs.js';
import { writeFile } from 'fs/promises';

export async function runOAuthClient(apiName: string): Promise<string> {
  return new Promise((resolve) => {
    if (
      typeof configs[apiName].clientID === 'undefined' ||
      typeof configs[apiName].clientSecret === 'undefined'
    ) {
      throw new Error(`Missing clientID or clientSecret for ${apiName}`);
    }
    passport.use(
      'provider',
      new OAuth2Strategy(configs[apiName], async function (
        accessToken,
        refreshToken,
        profile,
        done,
      ) {
        console.log(`Received OAuth token: ${accessToken}`);
        await writeFile(`.tokens/${apiName}.txt`, `${accessToken}\n`).catch((err) => {
          console.error(`Error writing token for ${apiName}:`, err);
        });
        void refreshToken; // To avoid unused variable warning
        void profile; // To avoid unused variable warning
        // Here you would typically find or create a user in your database
        // For this example, we'll just return the profile
        done(null, profile);
        app.close(() => {
          console.log('OAuth client server closed');
          resolve(accessToken);
        });
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
  });
}
