import 'dotenv/config';

export default {
  facebookApp: {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/api/v1/auth/facebook/callback',
    profileFields: ['id', 'email', 'displayName', 'name', 'gender', 'photos']
  },
  googleApp: {
    clientID: process.env.GOOGLE_CONSUMER_KEY,
    clientSecret: process.env.GOOGLE_CONSUMER_SECRET,
    callbackURL: '/api/v1/auth/google/callback'
  }
};
