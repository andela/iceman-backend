
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
// import passportJWT from 'passport-jwt';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Op } from 'sequelize';
import { User } from '../models';
import Helper from '../utils/helpers';

const {
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  GOOGLE_CONSUMER_KEY,
  GOOGLE_CONSUMER_SECRET
} = process.env;

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   const { dataValues: user } = await User.findOne({ where: { id } });
//   done(null, Helper.omitFields(user, ['password', 'google_id', 'facebook_id']));
// });

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CONSUMER_KEY,
  clientSecret: GOOGLE_CONSUMER_SECRET,
  callbackURL: '/api/v1/auth/google/callback'
},
async (token, tokenSecret, { _json: data }, done) => {
  const userDetails = {
    email: data.email,
    image: data.picture,
    google_id: data.sub,
    first_name: data.given_name,
    last_name: data.family_name
  };

  const { email, google_id } = userDetails;
  let result = await User.findOne({ where: { [Op.or]: [{ email }, { google_id }] } });

  if (!result) {
    result = await User.create(userDetails);
    return done(null, Helper.omitFields(result.dataValues, ['password', 'google_id', 'facebook_id']));
  }

  return done(null, Helper.omitFields(result.dataValues, ['password', 'google_id', 'facebook_id']));
}));

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: '/api/v1/auth/facebook/callback',
  profileFields: ['id', 'email', 'displayName', 'name', 'gender', 'photos']
},
async (accessToken, refreshToken, { _json: data }, done) => {
  const userDetails = {
    facebook_id: data.id,
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    middle_name: data.last_name,
    image: data.picture.data.url
  };

  const { email, facebook_id } = userDetails;
  let result = await User.findOne({ where: { [Op.or]: [{ email }, { facebook_id }] } });

  if (!result) {
    result = await User.create(userDetails);

    return done(null, Helper.omitFields(result.dataValues, ['password', 'google_id', 'facebook_id']));
  }
  return done(null, Helper.omitFields(result.dataValues, ['password', 'google_id', 'facebook_id']));
}));

// const JWTStrategy = passportJWT.Strategy;
// const ExtractJWT = passportJWT.ExtractJwt;

// passport.use(new JWTStrategy({
//   jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
//   secretOrKey: 'your_jwt_secret'
// },
// (jwtPayload, cb) => {
//   // find the user in db if needed
//   // This functionality may be omitted if you store everything you'll need in JWT payload.
//   return User.findOneById(jwtPayload.id)
//     .then((user) => {
//       return cb(null, user);
//     })
//     .catch((err) => {
//       return cb(err);
//     });
// }));
