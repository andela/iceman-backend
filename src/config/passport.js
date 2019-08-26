import passport from 'passport';
// import LocalStrategy from 'passport-local';
import { User } from '../models';

// const GoogleStrategy = require('passport-google-oauth').OAuthStrategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } = process.env;

// passport.use(new GoogleStrategy({
//   consumerKey: GOOGLE_CONSUMER_KEY,
//   consumerSecret: GOOGLE_CONSUMER_SECRET,
//   callbackURL: "http://www.example.com/auth/google/callback"
//   }, (token, tokenSecret, profile, done) => {
//       User.findOrCreate({ googleId: profile.id }, function (err, user) {
//         return done(err, user);
//       });
//   }
// ));

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: 'http://www.example.com/auth/facebook/callback'
},
(accessToken, refreshToken, profile, done) => {
  User.findOrCreate(profile, (err, user) => {
    if (err) { return done(err); }
    done(null, user);
  });
}));

// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: 'user[email]',
//       passwordField: 'user[password]'
//     },
//     ((email, password, done) => {
//       User.findOne({ email })
//         .then((user) => {
//           if (!user || !user.validPassword(password)) {
//             return done(null, false, {
//               errors: { 'email or password': 'is invalid' }
//             });
//           }

//           return done(null, user);
//         })
//         .catch(done);
//     })
//   )
// );
