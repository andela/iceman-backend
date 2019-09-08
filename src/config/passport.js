
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import config from './config';
import PassportController from '../controllers/passportController';
import MockStrategy from '../mock/mockedStrategy';

const { strategyCallback } = PassportController;

if (process.env.NODE_ENV === 'test') {
  passport.use(new MockStrategy('google', strategyCallback));
  passport.use(new MockStrategy('facebook', strategyCallback));
  passport.use(new MockStrategy('unauthorized', strategyCallback));
} else {
  passport.use(new GoogleStrategy(config.googleApp, strategyCallback));
  passport.use(new FacebookStrategy(config.facebookApp, strategyCallback));
}
