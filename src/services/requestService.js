import { Request } from '../models';

/**
 * Request service class
 */
export default class RequestService {
  /**
  * update trip rquest
  * @param {number} id - request id
  * @param {object} data - request object
  * @return {object} - updated request
  */
  static async updateRequest(id, data) {
    const userRequest = await Request.findOne({ where: { id } });

    if (!userRequest) throw new Error('Trip request not found');
    const { status } = userRequest;

    if (status !== 'pending') throw new Error(`Request has been ${status}. cannot edit`);
    const updatedRequest = await Request.update(data, { where: { id }, returning: true });

    return updatedRequest[1][0].dataValues;
  }
}
