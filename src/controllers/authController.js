import AuthService from '../services/authService';

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
   * @param {object} req request body
   * @param {object} res response body
   * @returns  {object} message
   */
  static async forgotPassword({ body: { email } }, res) {
    try {
      const data = await AuthService.forgotPassword(email);

      res.status(200).json({ status: 'success', data });
    } catch ({ message: error }) {
      res.status(400).json({ status: 'error', error });
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

      res.status(200).json({ status: 'success', message });
    } catch ({ message: error }) {
      res.status(400).json({ status: 'error', error });
    }
  }

  /**
 * @param {object} res - response object
 * @return {object} - user data and status code
 */
  static async signupUser({ body }, res) {
    try {
      const data = await AuthService.signup(body);

      res.status(201).json({ status: 'success', data });
    } catch ({ message: error }) {
      res.status(409).json({ status: 'error', error });
    }
  }
}
