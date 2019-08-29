import UsersService from '../services/usersService';

/**
 * Class for interacting with User profile information
 */
export default class UsersController {
/**
 * @param {object} user - user auth token payload
 * @param {object} res - response object
 * @return {object} user - return object containing status and data
 */
  static async getProfile({ user }, res) {
    try {
      const { id } = user;
      const userData = await UsersService.getProfile(id);

      res.status(200).json({ status: 'success', data: userData });
    } catch ({ message: error }) {
      res.status(400).json({ status: 'error', error });
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
      const updatedData = await UsersService.updateProfile(id, body);

      res.status(200).json({ status: 'success', data: updatedData });
    } catch ({ message: error }) {
      res.status(400).json({ status: 'error', error });
    }
  }
}
