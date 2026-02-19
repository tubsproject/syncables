import { OpenAPIV3 } from '@scalar/openapi-types';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { OAuth2Strategy } from 'passport-oauth';
import { readFile, writeFile } from 'fs/promises';

const port = 8000;

async function authorizationCodeFlow(
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

async function clientCredentialsFlow(
  apiName: string,
  securityScheme: OpenAPIV3.SecuritySchemeObject,
): Promise<string> {
  const tokenUrl = securityScheme.flows?.clientCredentials?.tokenUrl;
  const clientId =
    process.env[`${apiName.toUpperCase().replace('-', '_')}_CLIENT_ID`];
  const clientSecret =
    process.env[`${apiName.toUpperCase().replace('-', '_')}_CLIENT_SECRET`];
  if (!tokenUrl || !clientId || !clientSecret) {
    throw new Error(
      `Missing configuration for client credentials flow of ${apiName}`,
    );
  }
  const bodyObj: { [key: string]: string } = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
  };
  const audience = securityScheme.flows?.clientCredentials?.audience;
  if (audience) {
    bodyObj.audience = audience;
  }
  if (securityScheme.flows?.clientCredentials?.scopes) {
    const scopeStr = Object.keys(
      securityScheme.flows.clientCredentials.scopes,
    ).join(' ');
    bodyObj.scope = scopeStr;
  }
  // this is used by maventa
  const vendorApiKey =
    process.env[`${apiName.toUpperCase().replace('-', '_')}_VENDOR_API_KEY`];
  if (vendorApiKey) {
    bodyObj.vendor_api_key = vendorApiKey;
  }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyObj),
  };
  console.log(
    `Requesting token from ${tokenUrl} for ${apiName} with client ID ${clientId}`,
    options,
  );
  const response = await fetch(tokenUrl, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to obtain token for ${apiName}: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }
  const data = await response.json();
  const accessToken = data.access_token;
  if (!accessToken) {
    throw new Error(
      `No access token in response for ${apiName}: ${JSON.stringify(data)}`,
    );
  }
  await writeFile(`.tokens/${apiName}.txt`, `${accessToken}\n`).catch((err) => {
    console.error(`Error writing token for ${apiName}:`, err);
  });
  return accessToken;
}

async function acubeFlow(
  apiName: string,
  securityScheme: { email: string; password: string; loginUrl: string },
): Promise<string> {
  const email = process.env[`${apiName.toUpperCase().replace('-', '_')}_EMAIL`];
  const password =
    process.env[`${apiName.toUpperCase().replace('-', '_')}_PASSWORD`];
  if (!email || !password) {
    throw new Error(`Missing credentials for acube flow of ${apiName}`);
  }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  };
  console.log(
    `Requesting token from ${securityScheme.loginUrl} for ${apiName} with email ${email}`,
    options,
  );
  const response = await fetch(securityScheme.loginUrl, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to obtain token for ${apiName}: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }
  const data = await response.json();
  const accessToken = data.token; // as opposed to access_token which OAuth Client Credentials returns
  if (!accessToken) {
    throw new Error(
      `No access token in response for ${apiName}: ${JSON.stringify(data)}`,
    );
  }
  await writeFile(`.tokens/${apiName}.txt`, `${accessToken}\n`).catch((err) => {
    console.error(`Error writing token for ${apiName}:`, err);
  });
  return accessToken;
}

async function cognitoFlow(
  apiName: string,
  securityScheme: { cognitoUrl: string },
): Promise<string> {
  const clientId =
    process.env[`${apiName.toUpperCase().replace('-', '_')}_CLIENT_ID`];
  const username =
    process.env[`${apiName.toUpperCase().replace('-', '_')}_USERNAME`];
  const password =
    process.env[`${apiName.toUpperCase().replace('-', '_')}_PASSWORD`];
  if (!securityScheme.cognitoUrl) {
    throw new Error(`Missing Cognito URL for ${apiName}`);
  }
  if (!username) {
    throw new Error(`Missing username for cognito flow of ${apiName}`);
  }
  if (!password) {
    throw new Error(`Missing password for cognito flow of ${apiName}`);
  }
  if (!clientId) {
    throw new Error(`Missing client ID for cognito flow of ${apiName}`);
  }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
    },
    body: JSON.stringify({
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
      ClientId: clientId,
    }),
  };
  console.log(
    `Requesting token from ${securityScheme.cognitoUrl} for ${apiName} with username ${username}`,
    options,
  );
  const response = await fetch(securityScheme.cognitoUrl, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to obtain token for ${apiName}: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }
  const data = await response.json();
  const accessToken = data.AuthenticationResult?.AccessToken; // as opposed to access_token which OAuth Client Credentials returns
  if (!accessToken) {
    throw new Error(
      `No access token in response for ${apiName}: ${JSON.stringify(data)}`,
    );
  }
  await writeFile(`.tokens/${apiName}.txt`, `${accessToken}\n`).catch((err) => {
    console.error(`Error writing token for ${apiName}:`, err);
  });
  return accessToken;
}

function authorize(
  apiName: string,
  securityScheme: OpenAPIV3.SecuritySchemeObject,
): Promise<string> {
  if (securityScheme.type === 'oauth2') {
    if (securityScheme.flows?.clientCredentials) {
      console.log('Selected client credentials flow for', apiName);
      return clientCredentialsFlow(apiName, securityScheme);
    }
    if (securityScheme.flows?.authorizationCode) {
      console.log('Selected authorization code flow for', apiName);
      return authorizationCodeFlow(apiName, securityScheme);
    }
  }
  if ((securityScheme.type as string) === 'cognito') {
    console.log('Selected Cognito flow for', apiName, securityScheme);
    return cognitoFlow(
      apiName,
      securityScheme as {
        username: string;
        password: string;
        cognitoUrl: string;
      },
    );
  }
  if ((securityScheme.type as string) === 'acube') {
    return acubeFlow(
      apiName,
      securityScheme as { email: string; password: string; loginUrl: string },
    );
  }
  throw new Error('Unsupported security scheme');
}

export async function getBearerTokens(
  apiNames: string[],
  securitySchemeObjects: { [apiName: string]: OpenAPIV3.SecuritySchemeObject },
): Promise<{ [apiName: string]: string }> {
  const tokens: { [apiName: string]: string } = {};
  for (const apiName of apiNames) {
    console.log(`Checking for existing token for ${apiName}...`);
    const tokenPath = `.tokens/${apiName}.txt`;
    try {
      const token = await readFile(tokenPath, 'utf-8');
      tokens[apiName] = token.trim();
    } catch (err) {
      void err;
      console.error(
        `File ${tokenPath} not found for ${apiName}`,
      );
      console.log('Starting authorization flow for', apiName);
      tokens[apiName] = await authorize(
        apiName,
        securitySchemeObjects[apiName],
      );
      console.log('Completed authorization flow for', apiName);
    }
  }
  console.log('Obtained bearer tokens for all APIs');
  return tokens;
}
