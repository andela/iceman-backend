import jwt from 'jsonwebtoken';
import AuthService from '../services/authService';
import { User } from '../models';
import sendmail from '../services/mailer';
import Helper from '../utils/helpers';


/**
 * Class for authenticating  users
 */
export default class AuthController {
  /**
 * @param {object} res - response object
 * @return {object} user - return object containing status and data
 */
  static async loginUser({ body: { email, password } }, res) {
    try {
      const data = await AuthService.login(email, password);
      res.status(200).json({ status: 'success', data });
    } catch ({ message: error }) {
      res.status(400).json({ status: 'error', error });
    }
  }

  /**
 *
 * @param {*} res - response object
 * @return {object} - user data and status code
 */
  static async signupUser({
    body: {
      first_name, last_name, email, password
    }
  }, res) {
    try {
      const data = await AuthService.signup(first_name, last_name, email, password);
      res.status(201).json({ status: 'created', data });
    } catch ({ message: error }) {
      res.status(409).json({ status: 'error', error });
      const data = await AuthService.login(email, password);
      res.status(200).json({ status: 'success', data });
    }
  }

  /**
   * @param {object} req request body
   * @param {object} res response body
   * @returns  {object} message
   */
  static async forgotPassword(req, res) {
    const { body: { email } } = req;
    const result = await User.findOne({ where: { email } });
    if (result === null) {
      return res.status(404).send({
        message: 'Email not found'
      });
    }
    const { username } = result;
    const token = Helper.genToken({
      email
    }, process.env.JWTSECRET, { expiresIn: '1h' });
    const emailDetails = {
      receiver: email,
      sender: 'chubi.best@gmail.com',
      templateName: 'reset_password',
      name: username,
      confirm_account__url: `provide_newpass/resetPassword/${token}`
    };
    sendmail(emailDetails);
    return res.status(200).send({ message: `Email has been sent to ${email}`, token });
  }

  /**
   * @param {object} req request body
   * @param {object} res response body
   * @returns  {object} message
   */
  static async resetPassword(req, res) {
    try {
      const { params: { token }, body: { password } } = req;
      const { email } = jwt.verify(token, process.env.JWTSECRET);
      const newPassword = await Helper.encryptor(password);
      User.update({
        password: newPassword
      }, {
        where: {
          email
        }
      });
      return res.status(200).send({
        message: 'Password changed'
      });
    } catch (e) {
      if (e.message === 'jwt malformed') {
        return res.status(403).send({
          error: 'Token Expired'
        });
      }
      res.status(500).send({
        message: 'Something went wrong'
      });
    }
  }
}
