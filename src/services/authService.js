import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Helper from '../utils/helpers';
import { User } from '../models';

const jwtSecret = process.env.JWTSECRET;

/**
 * Class to authenticate User
 */
export default class AuthService {
/**
 * @param {string} email - valid email address
 * @param {string} password - valid password
 * @return {string} - token
 */
  static async login(email, password) {
    const result = await User.findOne({ where: { email, is_verified: true } });

    if (!result) throw new Error('The account does not exists or not yet verified');

    const { dataValues: user } = result;
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new Error('Please provide valid login credentials');

    const payload = { id: user.id, is_admin: user.is_admin };
    const token = await jwt.sign(payload, jwtSecret, { expiresIn: '1hr' });

    return { token, ...Helper.omitFields(user, ['password']) };
  }

  /**
   *
   * @param {Object} userDetails - users input details
   * @return {JSON} - json format
   */
  static async signup(userDetails) {
    const {
      first_name, last_name, email, password
    } = userDetails;

    const checkEmail = await User.findOne({ where: { email } });

    if (checkEmail) throw new Error(`Email '${email}' already exists`);

    const encryptedPassword = await Helper.encryptor(password);

    const result = await User.create({
      first_name,
      last_name,
      email,
      password: encryptedPassword
    });

    const { dataValues: user } = result;
    const payload = { id: user.id, is_admin: user.is_admin };

    const token = Helper.genToken(payload);

    return { token, ...Helper.omitFields(user, ['password']) };
  }
}
