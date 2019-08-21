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
    const error = 'Invalid Credentials';
    const result = await AuthService.login(email, password);
    if (result === error) return res.status(400).json({ status: 'error', error });
    return res.status(200).json({ status: 'success', data: result });
  }
}
