import AuthService from '../services/authService';
import Response from '../utils/response';

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

      Response.success(res, data);
    } catch ({ message: error }) {
      Response.badRequest(res, error);
    }
  }

  /**
   * @param {object} req request body
   * @param {object} res response body
   * @returns  {object} message
   */
  static async forgotPassword({ body: { email } }, res) {
    try {
      const data = await AuthService.forgotPassword(email);

      Response.success(res, data);
    } catch ({ message: error }) {
      Response.badRequest(res, error);
    }
  }

  /**
   * @param {object} req request body
   * @param {object} res response body
   * @returns  {object} message
   */
  static async resetPassword({ params: { token }, body: { password } }, res) {
    try {
      const message = await AuthService.resetPassword(token, password);

      Response.success(res, message);
    } catch ({ message: error }) {
      Response.badRequest(res, error);
    }
  }

  /**
 * @param {object} res - response object
 * @return {object} - user data and status code
 */
  static async signupUser({ body }, res) {
    try {
      const data = await AuthService.signup(body);

      await AuthService.verificationLink(data);

      res.status(201).json({ status: 'success', data });
    } catch ({ message: error }) {
      Response.badRequest(res, error, 409);
    }
  }

  /**
   * @param {req} req - request object
   * @param {res} res - response object
   * @return {object} - message
   */
  static async verifyUser(req, res) {
    try {
      const { token } = req.query;
      const isVerified = await AuthService.verify(token);

      return res.status(200).json({ status: 'success', message: isVerified });
    } catch ({ message: error }) {
      res.status(400).json({ status: 'error', error });
    }
  }

  /**
   * @param {res} res - response object
   * @return {object} - message
   */
  static async resendVerification({ body }, res) {
    try {
      const resend = await AuthService.verificationLink(body);

      return res.status(200).json({ status: 'success', message: resend });
    } catch ({ message: error }) {
      res.status(400).json({ status: 'error', error });
    }
  }
}
