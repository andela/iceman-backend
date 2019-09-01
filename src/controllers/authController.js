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

      Response.success(res, data, 201);
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

      Response.successMessage(res, isVerified);
    } catch ({ message: error }) {
      Response.badRequest(res, error);
    }
  }

  /**
   * @param {res} res - response object
   * @return {object} - message
   */
  static async resendVerification({ body }, res) {
    try {
      const resend = await AuthService.verificationLink(body);

      Response.successMessage(res, resend);
    } catch ({ message: error }) {
      Response.badRequest(res, error);
    }
  }
}
