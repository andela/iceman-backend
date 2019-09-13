import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import Helper from '../utils/helpers';
import { User, Role } from '../models';
import sendmail from './emailService';
import Response from '../utils/response';

const { error } = Response;
config();

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
    const result = await User.findOne({ where: { email } });

    if (!result) error('The account does not exist');

    const userRole = await Role.findOne({ where: { id: result.dataValues.roleId } });

    if (userRole.dataValues.type === 'guest') error('Please Verify Your Email Address');

    const { dataValues: user } = result;
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) error('Please provide valid login credentials');

    const payload = { id: user.id, roleId: user.roleId };
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

    if (!result) error('Email not found');

    const { dataValues: { firstName: name, } } = result;
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
      resetToken: token
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
    const { dataValues: { resetToken: tokenSaved } } = await User.findOne({ where: { email } });

    if (token !== tokenSaved) error('Invalid token');

    const newPassword = await Helper.encryptor(password);
    const options = {
      password: newPassword,
      resetToken: null
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

    if (checkEmail) error(`Email '${email}' already exists`);

    userDetails.password = await Helper.encryptor(password);

    const result = await User.create(userDetails);
    const { dataValues: user } = result;

    const payload = Helper.pickFields(user, ['id', 'roleId']);
    const token = await Helper.genToken(payload);

    return { token, ...Helper.omitFields(user, ['password', 'createdat', 'updatedat']) };
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
    const isExpire = await Helper.verifyToken(token);

    if (!isExpire) error('Expired Verification Link, resend verification Link');

    const isUser = await User.findOne({
      where:
      {
        id: isExpire.id
      },
      include: [{
        model: Role,
        attributes: ['type']
      }]
    });

    if (!isUser) error('User not found');

    if (isUser.dataValues.Role.dataValues.type !== 'guest') error('User Email is Already Verified');

    await User.update({ roleId: 5 }, { where: { id: isExpire.id } });

    return 'Email Verification Successful';
  }

  /**
   * @param {Object} body user email
   * @returns {String} success message
   */
  static async verificationLink(body) {
    const { email } = body;
    const isUser = await User.findOne({
      where: {
        email
      },
      include: [{
        model: Role,
        attributes: ['type']
      }]
    });

    if (!isUser) error('User not found');

    if (isUser.dataValues.Role.dataValues.type !== 'guest') throw new Error('User Email is Already Verified');

    const token = Helper.genToken({ id: isUser.dataValues.id });
    const url = `${process.env.APP_URL}/verify?token=${token}`;
    const userDetails = {
      receiver: isUser.dataValues.email,
      sender: process.env.SENDER,
      templateName: 'verify_email',
      name: isUser.dataValues.firstName,
      url
    };

    await sendmail(userDetails);

    return 'Verification Link Sent';
  }

  /**
 * @param {number} userId - ID of logged in user
 * @return {object} - object containing user profile information
 */
  static async getProfile(userId) {
    const result = await User.findOne({ where: { id: userId } });

    if (!result) error('User not found');

    const { dataValues: user } = result;

    return Helper.omitFields(user, ['password']);
  }

  /**
* @param {number} userId - ID of logged in user
* @param {object} profileDetails - object containing details to be changed
* @return {object} - object containing updated user profile information
*/
  static async updateProfile(userId, profileDetails) {
    const isUser = await User.findOne({ where: { id: userId } });

    if (!isUser) error('User not found');

    const result = await User.update(profileDetails, { returning: true, where: { id: userId } });
    const [, [{ dataValues: updatedData }]] = result;

    return Helper.omitFields(updatedData, ['password']);
  }

  /**
   * @param {object} body user details
   * @return {string} - success message;
   */
  static async assignUser(body) {
    const { email, roleId } = body;
    const getUser = await User.findOne({
      where: {
        email
      },
      include: [{
        model: Role,
        attributes: ['type']
      }]
    });

    if (!getUser) error('User not found');

    if (getUser.dataValues.Role.dataValues.type === 'guest') error('User email is not verified');

    if (getUser.dataValues.roleId === Number(roleId)) error('User is already assigned this role');

    await User.update({ roleId: Number(roleId) }, { where: { email } });

    return 'User Role Assigned Successfully';
  }
}
