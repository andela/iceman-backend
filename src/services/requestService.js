import { Request } from '../models';
import Response from '../utils/response';

const { error } = Response;

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
  static async updateRequest({ body, params, user: { id } }) {
    const userRequest = await Request.findOne({ where: { id: params.requestId } });

    if (!userRequest) error('Trip request not found');

    const { user_id, status } = userRequest;

    if (user_id !== id) error('You are not allowed to edit this request');

    if (body.trip_type === 'one-way') body.return_date = null;

    if (status !== 'open') error(`Request has been ${status}. cannot edit`);

    const updatedRequest = await Request.update(body, { where: { id }, returning: true });

    return updatedRequest[1][0].dataValues;
  }

  /**
   * @param {object} details trip details
   * @returns{void}
   */
  static async oneway({ body, user: { id } }) {
    const { travel_date } = body;
    const existingRequest = await Request.count({ where: { travel_date, user_id: id } });

    if (existingRequest) error('You\'ve already booked this trip');

    return Request.create({ ...body, user_id: id });
  }

  /**
   * @param {object} body - arrays of request object
   * @returns {object} obej - return object
   */
  static async multiCityRequest({ body, user: { id } }) {
    const { travel_date } = body;
    const existingRequest = await Request.count({ where: { travel_date, user_id: id } });

    if (existingRequest) error('You\'ve already booked this trip');

    const { dataValues } = await Request.create({ ...body, user_id: id });

    return dataValues;
  }
}
