import AuthService from '../services/authService';
import Response from '../utils/response';

const { success, badRequest, successMessage } = Response;
const {
  login,
  signup,
  verify,
  verificationLink,
  getProfile,
  updateProfile,
  assignUser,
} = AuthService;

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
      const data = await login(email, password);

      success(res, data);
    } catch ({ message: error }) {
      badRequest(res, error);
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

      success(res, data);
    } catch ({ message: error }) {
      badRequest(res, error);
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

      success(res, message);
    } catch ({ message: error }) {
      badRequest(res, error);
    }
  }

  /**
 * @param {object} res - response object
 * @return {object} - user data and status code
 */
  static async signupUser({ body }, res) {
    try {
      const data = await signup(body);

      await verificationLink(data);

      success(res, data, 201);
    } catch ({ message: error }) {
      badRequest(res, error, 409);
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
      const isVerified = await verify(token);

      successMessage(res, isVerified);
    } catch ({ message: error }) {
      badRequest(res, error);
    }
  }

  /**
   * @param {res} res - response object
   * @return {object} - message
   */
  static async resendVerification({ body }, res) {
    try {
      const resend = await verificationLink(body);

      successMessage(res, resend);
    } catch ({ message: error }) {
      badRequest(res, error);
    }
  }

  /**
 * @param {object} user - user auth token payload
 * @param {object} res - response object
 * @return {object} user - return object containing status and data
 */
  static async getProfile({ user }, res) {
    try {
      const { id } = user;
      const userData = await getProfile(id);

      success(res, userData);
    } catch ({ message: error }) {
      badRequest(res, error);
    }
  }

  /**
* @param {object} user - user auth token payload
* @param {object} res - response object
* @return {object} user - return object containing status and data
*/
  static async updateProfile({ body, user }, res) {
    try {
      const { id } = user;
      const updatedData = await updateProfile(id, body);

      success(res, updatedData);
    } catch ({ message: error }) {
      badRequest(res, error);
    }
  }

  /**
   * @param {object} res response object
   * @return {object} message
   */
  static async assignRole({ body }, res) {
    try {
      const assign = await assignUser(body);

      successMessage(res, assign);
    } catch ({ message: error }) {
      badRequest(res, error);
    }
  }
}
