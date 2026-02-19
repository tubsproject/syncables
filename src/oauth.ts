import { OpenAPIV3 } from '@scalar/openapi-types';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { OAuth2Strategy } from 'passport-oauth';
import { port } from './configs.js';
import { writeFile } from 'fs/promises';

export async function runOAuthClient(
  apiName: string,
  securityScheme: OpenAPIV3.SecuritySchemeObject,
): Promise<string> {
  const app = express();
  const passportConfig = {
    authorizationURL: securityScheme.flows?.authorizationCode?.authorizationUrl,
    tokenURL: securityScheme.flows?.authorizationCode?.tokenUrl,
    clientID:
      process.env[`${apiName.toUpperCase().replace('-', '_')}_CLIENT_ID`],
    clientSecret:
      process.env[`${apiName.toUpperCase().replace('-', '_')}_CLIENT_SECRET`],
    callbackURL: `http://localhost:${port}/callback`,
  };
  console.log('passportConfig:', apiName, passportConfig);
  const promise: Promise<string> = new Promise((resolve) => {
    passport.use(
      'provider',
      new OAuth2Strategy(passportConfig, async function (
        accessToken,
        refreshToken,
        profile,
        done,
      ) {
        console.log(`Received OAuth token: ${accessToken}`);
        await writeFile(`.tokens/${apiName}.txt`, `${accessToken}\n`).catch(
          (err) => {
            console.error(`Error writing token for ${apiName}:`, err);
          },
        );
        void refreshToken; // To avoid unused variable warning
        void profile; // To avoid unused variable warning
        // Here you would typically find or create a user in your database
        // For this example, we'll just return the profile
        done(null, profile);
        resolve(accessToken);
      }),
    );
  });
  app.use(
    session({
      secret:
        process.env[
          `${apiName.toUpperCase().replace('-', '_')}_CLIENT_SECRET`
        ] || 'default_secret',
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

  app.get('/success', (req, res) => {
    void req; // To avoid unused variable warning
    res.send(
      `Logged in to ${apiName}, redirecting...</a><script>setTimeout(() => { window.location = '/ '; }, 3000);</script>`,
    );
  });

  // Redirect the user to the OAuth 2.0 provider for authentication.  When
  // complete, the provider will redirect the user back to the application at
  //     /auth/provider/callback
  app.get(
    '/auth/provider',
    passport.authenticate('provider', {
      scope: securityScheme.flows?.authorizationCode?.scopes
        ? Object.keys(securityScheme.flows.authorizationCode.scopes)
        : [],
    }),
  );

  // The OAuth 2.0 provider has redirected the user back to the application.
  // Finish the authentication process by attempting to obtain an access
  // token.  If authorization was granted, the user will be logged in.
  // Otherwise, authentication has failed.
  app.get(
    '/callback',
    passport.authenticate('provider', {
      successRedirect: '/success',
      failureRedirect: '/login',
    }),
  );

  const server = app.listen(port, () => {
    console.log(`OAuth client listening on port ${port}`);
  });
  const token = await promise;
  console.log('Received token, giving browser time to render');
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('Shutting down OAuth client server...');
  const closed = new Promise<void>((resolve) =>
    server.close(() => {
      console.log('OAuth client server closed');
      resolve();
    }),
  );
  server.closeAllConnections();
  await closed;
  console.log('OAuth client server shutdown complete');
  return token;
}
