import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Helper from '../utils/helpers';
import { User } from '../models';
import sendmail from './emailService';


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
 * @param {string} email email address
 * @returns {string} token
 */
  static async forgotPassword(email) {
    const result = await User.findOne({ where: { email } });

    if (!result) throw new Error('Email not found');

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
    if (token !== tokenSaved) throw new Error('Invalid token');

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

    if (checkEmail) throw new Error(`Email '${email}' already exists`);

    userDetails.password = await Helper.encryptor(password);

    const result = await User.create(userDetails);
    const { dataValues: user } = result;
    const payload = Helper.pickFields(user, ['id', 'is_admin']);
    const token = await Helper.genToken(payload);

    return { token, ...Helper.omitFields(user, ['password']) };
  }

  /**
     *
     * @param {Object} data user data
     * @returns {Boolean} true
     */
  static async signUpMail(data) {
    const message = {
      templateName: 'verify_email',
      sender: process.env.sender,
      receiver: data.email,
      name: `${data.first_name} ${data.last_name}`,
      confirm_account__url: `${process.env.APP_URL}/verify?activate=${data.token}&&id=${data.id}`
    };

    await sendMail(message);

    return true;
  }

  /**
     *
     * @param {Object} req query
     * @param {Object} res body
     * @returns {JSON} data
     */
  static async verifyUser(req, res) {
    const { activate, id } = req.query;

    const verify = Helper.verifyToken(activate);

    const is_user = await User.findOne({ where: { id: Number(id) } });

    if (!is_user) throw new Error('User not find, please sign up');

    if (!verify && !is_user.dataValues.is_verified) {
      const { dataValues: user } = is_user;

      const payloader = Helper.pickFields(user, ['id', 'is_admin']);

      const token = Helper.genToken(payloader);

      const data = {
        templateName: 'verify_email',
        sender: process.env.sender,
        receiver: is_user.dataValues.email,
        name: `${is_user.dataValues.first_name} ${is_user.dataValues.last_name}`,
        confirm_account__url: `${process.env.APP_URL}/verify?activate=${token}&&id=${is_user.dataValues.id}`
      };

      await sendMail(data);
      throw new Error('Expired or Invalid Verification Link. Check your Email For a new verification Link');
    }

    if (is_user.dataValues.is_verified) throw new Error('User Email is Already Verified');

    await User.update({ is_verified: true }, { where: { id: verify.id } });

    return true;
  }
}
