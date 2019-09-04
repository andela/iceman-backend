
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import config from './config';
import PassportController from '../controllers/passportController';
import MockStrategy from './mockedStrategy';

if (process.env.NODE_ENV === 'test') {
  passport.use(new MockStrategy('google', PassportController.strategyCallback));
  passport.use(new MockStrategy('facebook', PassportController.strategyCallback));
  passport.use(new MockStrategy('unauthorized', PassportController.strategyCallback));
} else {
  passport.use(new GoogleStrategy(config.googleApp, PassportController.strategyCallback));
  passport.use(new FacebookStrategy(config.facebookApp, PassportController.strategyCallback));
}
