import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Helper from '../utils/helpers';
import { User } from '../models';
import sendmail from './emailService';
import Response from '../utils/response';

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

    if (!result) Response.error('The account does not exists or not yet verified');

    const { dataValues: user } = result;
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) Response.error('Please provide valid login credentials');

    const payload = { id: user.id, is_admin: user.is_admin };
    const token = await jwt.sign(payload, jwtSecret, { expiresIn: '1hr' });

    return { token, ...Helper.omitFields(user, ['password']) };
  }

  /**
 *
 * @param {string} email email address
 * @returns {string} token
 */
  static async forgotPassword(email) {
    const result = await User.findOne({ where: { email } });

    if (!result) Response.error('Email not found');

    const { dataValues: { first_name: name, } } = result;
    const token = await jwt.sign({
      email
    }, jwtSecret, { expiresIn: '1h' });
    const emailDetails = {
      receiver: email,
      sender: process.env.SENDER,
      templateName: 'reset_password',
      name,
      url: `${process.env.APP_URL}/reset_password/${token}`
    };

    await sendmail(emailDetails);

    const options = {
      reset_token: token
    };

    this.updateUser({ email }, options);

    return { token };
  }

  /**
   *
   * @param {string} token request token
   * @param {string} password new password
   * @returns {string} message
   * */
  static async resetPassword(token, password) {
    const { email } = await jwt.verify(token, jwtSecret);
    const { dataValues: { reset_token: tokenSaved } } = await User.findOne({ where: { email } });
    if (token !== tokenSaved) Response.error('Invalid token');

    const newPassword = await Helper.encryptor(password);
    const options = {
      password: newPassword,
      reset_token: null
    };
    this.updateUser({ email }, options);

    return 'Password reset successfully';
  }

  /**
   *
   * @param {object} userDetails - users input details
   * @return {json} - json format
   * */
  static async signup(userDetails) {
    const { email, password } = userDetails;
    const checkEmail = await User.findOne({ where: { email } });

    if (checkEmail) Response.error(`Email '${email}' already exists`);

    userDetails.password = await Helper.encryptor(password);

    const result = await User.create(userDetails);
    const { dataValues: user } = result;
    const payload = Helper.pickFields(user, ['id', 'is_admin']);
    const token = await Helper.genToken(payload);

    return { token, ...Helper.omitFields(user, ['password']) };
  }

  /**
   *
   * @param {object} query condition
   * @param {object} options update items
   * @returns {object} data
   */
  static async updateUser(query, options) {
    return User.update(options, {
      where: {
        ...query
      }
    });
  }

  /**
   * @param {Object} token user token
   * @returns {String} success message
   */
  static async verify(token) {
    const isExpire = Helper.verifyToken(token);

    if (!isExpire) Response.error('Expired Verification Link, resend verification Link');

    const isUser = await User.findOne({ where: { id: isExpire.id } });

    if (!isUser) Response.error('User not find');

    if (isUser.dataValues.is_verified) Response.error('User Email is Already Verified');

    await User.update({ is_verified: true }, { where: { id: isExpire.id } });

    return 'Email Verification Successful';
  }

  /**
   * @param {Object} body user email
   * @returns {String} success message
   */
  static async verificationLink(body) {
    const { email } = body;
    const isUser = await User.findOne({ where: { email } });

    if (!isUser) Response.error('User not found');

    if (isUser.dataValues.is_verified) Response.error('User Email is Already Verified');

    const token = Helper.genToken({ id: isUser.dataValues.id });
    const url = `${process.env.APP_URL}/verify?token=${token}`;
    const userDetails = {
      receiver: isUser.dataValues.email,
      sender: process.env.SENDER,
      templateName: 'verify_email',
      name: isUser.dataValues.first_name,
      url
    };

    await sendmail(userDetails);

    return 'Verification Link Sent';
  }
}
