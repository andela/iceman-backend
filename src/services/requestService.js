import { Request, MultiRequest } from '../models';

/**
 * Class for managing trip request
 */
export default class RequestService {
  /**
   * @param {object} body - arrays of request object
   * @returns {object} obej - return object
   */
  static async multiCityRequest({ body, user }) {
    if (body.length < 1) throw new Error('The request cannot be empty');

    const request = await Request.create({ ...body[0], user_id: user.id });

    body.splice(0, 1);

    const resetRequest = body.map((trip) => ({ ...trip, request_id: request.dataValues.id }));
    const multiRequest = await MultiRequest.bulkCreate(resetRequest, { returning: true });

    return { request, multiRequest };
  }
}
