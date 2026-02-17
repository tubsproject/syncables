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
export { configs, port };

