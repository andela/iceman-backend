import passport from 'passport';
import { Op } from 'sequelize';
import Helper from '../utils/helpers';
import { User } from '../models';
import Response from '../utils/response';

/**
 * Class for managing passport strategies
 */
export default class PassportController {
  /**
   * @param {string} provider  - it takes the name of the provider e.g facebook, google
   * @param {array} scope - list of content required from the user profile
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

        const payload = Helper.pickFields(user, ['id', 'roleId']);
        const token = Helper.genToken(payload);

        return Response.success(res, { token, ...user });
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
      const { email, socialId } = user;
      let result = await User.findOne({ where: { [Op.or]: [{ email }, { socialId }] } });

      if (!result) {
        result = await User.create(user);
        return done(null, Helper.omitFields(result.dataValues, ['password', 'socialId']));
      }

      return done(null, Helper.omitFields(result.dataValues, ['password', 'socialId']));
    } catch (error) {
      Response.error(error);
    }
  }
}
