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
    const request = await Request.create({ ...body[0], userId: user.id });

    if (!request) throw new Error('The operation was not successful');

    body.splice(0, 1);

    const resetRequest = body.map((trip) => ({ ...trip, requestId: request.dataValues.id }));

    const multiRequest = await MultiRequest.bulkCreate(resetRequest, { returning: true });
    return multiRequest;
  }
}
