import passport from 'passport';
import { Op } from 'sequelize';
import Helper from '../utils/helpers';
import { User } from '../models';

/**
 * Class for managing passport strategies
 */
export default class PassportController {
  /**
   * @param {string} provider  - it takes the name of the provider e.g facebook, google
   * @param {array} scope - list of cntent required from the user profile
   * @returns {object} - the profile of user
   */
  static authenticate(provider, scope) {
    return passport.authenticate(provider, { session: false, scope });
  }

  /**
   * @param {string} provider  - it takes the name of the provider e.g facebook, google
   * @returns {json} - json object with the user token
   */
  static callback(provider) {
    return (req, res, next) => {
      passport.authenticate(provider, { session: false }, (err, user, info) => {
        if (err || !user) {
          return res.status(400).json({
            status: 'error',
            error: 'Something is not right',
          });
        }

        const payload = Helper.pickFields(user, ['id', 'is_admin']);
        const token = Helper.genToken(payload);

        return res.json({ status: 'success', data: { token, ...user } });
      })(req, res, next);
    };
  }

  /**
 * @param {string} token - null
 * @param {string} tokenSecret  - null
 * @param {object} profile - the profile of the user
 * @param {*} done - end the process
 * @returns {object} user - return user details
 */
  static async strategyCallback(token, tokenSecret, profile, done) {
    try {
      const user = Helper.getUserSocialDetails(profile);
      const { email, social_id } = user;
      let result = await User.findOne({ where: { [Op.or]: [{ email }, { social_id }] } });

      if (!result) {
        result = await User.create(user);
        return done(null, Helper.omitFields(result.dataValues, ['password', 'social_id']));
      }

      return done(null, Helper.omitFields(result.dataValues, ['password', 'social_id']));
    } catch (error) {
      return new Error(error);
    }
  }
}
