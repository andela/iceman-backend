import passport from 'passport';
import Helper from '../utils/helpers';

export const googlePlugin = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        status: 'error',
        error: 'Something is not right',
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      const payload = Helper.pickFields(user, ['id', 'is_admin']);
      const token = Helper.genToken(payload);
      return res.json({ status: 'success', data: { token, ...user } });
    });
  })(req, res, next);
};

export const facebookPlugin = (req, res, next) => {
  passport.authenticate('facebook', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        status: 'error',
        error: 'Something is not right',
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      const payload = Helper.pickFields(user, ['id', 'is_admin']);
      const token = Helper.genToken(payload);
      return res.json({ status: 'success', data: { token, ...user } });
    });
  })(req, res, next);
};
