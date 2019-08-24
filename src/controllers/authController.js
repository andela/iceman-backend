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

      Response.success(res, data, 201);

      await send(data);

      res.status(201).json({ status: 'success', data });
    } catch ({ message: error }) {
      Response.badRequest(res, error, 409);
    }
  }

  /**
  @static
  * @description Returns message based on the status
  * @param {*} req - request object
  * @param {*} res - response object
  * @return {object} - message
  * @memberof AuthController
  */
  static async verify(req, res) {
    try {
      const is_verified = await AuthService.verifyUser(req, res);
      if (is_verified) {
        return res.status(200).json({ message: 'Email Successfully Verified' });
      }
    } catch (error) {
      const { status, message } = error;
      return Helper.errorstatus(res, status, `${message}`);
    }
  }
}
