import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import Helper from './helpers';

const jwtSecret = process.env.JWTSECRET;

/**
 * Helper class for query test database
 */
export default class TestDatabase {
  /**
   * Method to exclude properties from an object
   * @param {object} data - object containing user details
   * @returns {string} - user token
   */
  static async createUser(data) {
    const user = { ...data };
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    const { dataValues: result } = await User.create(user);
    const payload = { id: result.id, is_admin: result.is_admin };
    const token = await jwt.sign(payload, jwtSecret, { expiresIn: '1hr' });
    return { token, ...Helper.omitFields(result, ['password']) };
  }

  /**
   * Method to exclude properties from an object
   * @param {string} email - email of the user
   * @returns {integer} - return 1 if success or 0 if failed
   */
  static destroyUsers() {
    return User.destroy({ truncate: true, restartIdentity: true });
  }
}
