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
 *  @return {string} - token
 */
  static async login(email, password) {
    const result = await User.findOne({ where: { email, is_verified: true } });
    if (!result) return 'Invalid Credentials';

    const { dataValues: user } = result;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return 'Invalid Credentials';

    const payload = { id: user.id, is_admin: user.is_admin };
    const token = await jwt.sign(payload, jwtSecret, { expiresIn: '1hr' });

    return { token, ...Helper.omitFields(user, ['password']) };
  }
}
