// CONFIGURATION
const port = 8000;

// components.securitySchemes.Oauth2c.flows.authorizationCode:
// .authorizationUrl: 'https://accounts.google.com/o/oauth2/auth'
// .tokenUrl: 'https://accounts.google.com/o/oauth2/token'
// .scopes:
// - 'https://www.googleapis.com/auth/calendar.events': View and edit events on all your calendars
// - 'https://www.googleapis.com/auth/calendar.events.readonly': View events on all your calendars
// - 'https://www.googleapis.com/auth/calendar.readonly': View calendar metadata


const configs = {
  'google-calendar': {
    spec: {
      authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
        scope: [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.acls.readonly',
        'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
      ],
    },
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${port}/callback`,
  },
  moneybird: {
    spec: {
      authorizationUrl: 'https://moneybird.com/oauth/authorize',
      tokenUrl: 'https://moneybird.com/oauth/token',
      scope: [
        'sales_invoices',
        'documents',
        'estimates',
        'bank',
        'time_entries',
        'settings',
      ],
    },
    clientID: process.env.MONEYBIRD_CLIENT_ID,
    clientSecret: process.env.MONEYBIRD_CLIENT_SECRET,
    callbackURL: `http://localhost:${port}/callback`,
  },
};
export { configs, port };
