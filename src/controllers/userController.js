import UserService from '../services/userService';
import Response from '../utils/response';

const { badRequest, successMessage } = Response;

/**
 * Class for Users
 */
export default class UsersController {
  /**
   * @param {*} req - request
   * @param {*} res response
   * @return {object} message
   */
  static async assignRole(req, res) {
    try {
      const assign = await UserService.assignUser(req);

      successMessage(res, assign);
    } catch ({ message: error }) {
      badRequest(res, error);
    }
  }
}
