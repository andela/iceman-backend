import 'dotenv/config';

let BASE_URL;

if (process.env.NODE_ENV === 'development') {
  BASE_URL = 'http://localhost:3000';
} else if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'https://iceman-backend.herokuapp.com';
} else {
  BASE_URL = 'https://iceman-backend-staging.herokuapp.com';
}

export default {
  facebookApp: {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${BASE_URL}/api/v1/auth/facebook/callback`,
    profileFields: ['id', 'email', 'displayName', 'name', 'gender', 'photos']
  },
  googleApp: {
    clientID: process.env.GOOGLE_CONSUMER_KEY,
    clientSecret: process.env.GOOGLE_CONSUMER_SECRET,
    callbackURL: `${BASE_URL}/api/v1/auth/google/callback`
  }
};
