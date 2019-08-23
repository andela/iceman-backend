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
      const data = await AuthService.signup({
        first_name, last_name, email, password
      });
      res.status(201).json({ status: 'created', data });
    } catch ({ message: error }) {
      res.status(409).json({ status: 'error', error });
    }
  }
}
