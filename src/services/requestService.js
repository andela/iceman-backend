import { Request } from '../models';

/**
 * Class for managing trip request
 */
export default class RequestService {
  /**
   * @param {object} body - arrays of request object
   * @returns {object} obej - return object
   */
  static async multiCityRequest({ body, user }) {
    const { dataValues } = await Request.create({ ...body, user_id: user.id });

    return dataValues;
  }
}
