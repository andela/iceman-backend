import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../models';
import Helper from './helpers';

dotenv.config();

const jwtSecret = process.env.JWTSECRET;

/**
 * Helper class for query test database
 */
export default class TestHelper {
  /**
   * Method to exclude properties from an object
   * @param {object} data - object containing user details
   * @returns {string} - user token
   */
  static async createUser(data) {
    const user = { ...data };
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(user.password, salt);

    const { dataValues: result } = await db.User.create(user);
    const payload = { id: result.id, is_admin: result.is_admin };
    const token = await jwt.sign(payload, jwtSecret, { expiresIn: '1hr' });

    return { token, ...Helper.omitFields(result, ['password']) };
  }

  /**
   * Method to exclude properties from an object
   * @param {string} modelName - model to droped
   * @returns {integer} - return 1 if success or 0 if failed
   */
  static destroyModel(modelName) {
    db[modelName].destroy({ truncate: true, restartIdentity: true });
  }
}
