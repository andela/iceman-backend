import Helper from '../utils/helpers';
import { User } from '../models';

/**
 * Class to interact with User profile information
 */
export default class UsersService {
/**
 * @param {number} userId - ID of logged in user
 * @return {object} - object containing user profile information
 */
  static async getProfile(userId) {
    const result = await User.findOne({ where: { id: userId } });
    const { dataValues: user } = result;
    return Helper.omitFields(user, ['password']);
  }

  /**
 * @param {number} userId - ID of logged in user
 * @param {object} profileDetails - object containing details to be changed
 * @return {object} - object containing updated user profile information
 */
  static async updateProfile(userId, profileDetails) {
    const importantFields = Helper.pickFields(profileDetails, [
      'first_name',
      'last_name',
      'gender',
      'preferred_language',
      'residential_address',
      'preferred_currency',
      'date_of_birth',
    ]);
    const result = await User.update(importantFields, { returning: true, where: { id: userId } });
    const [, [{ dataValues: updatedData }]] = result;
    return Helper.omitFields(updatedData, ['password']);
  }
}
