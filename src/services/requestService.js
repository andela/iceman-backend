import { Request } from '../models';
import Response from '../utils/response';
import Helper from '../utils/helpers';

const { error } = Response;

/**
 * Request service class
 */
export default class RequestService {
  /**
   * Getting a request
   * @param {number} id -request id
   * @return {object} - request object
   */
  static async getRequest(id) {
    const userRequest = await Request.findOne({ where: { id }, returning: true });

    if (!userRequest) error('Trip request not found');

    return userRequest;
  }

  /**
  * update trip rquest
  * @param {number} id - request id
  * @param {object} data - request object
  * @return {object} - updated request
  */
  static async updateRequest(id, data) {
    const userRequest = await Request.findOne({ where: { id } });

    if (!userRequest) error('Trip request not found');
    const { status } = userRequest;

    if (status !== 'open') error(`Request has been ${status}. cannot edit`);
    const updatedRequest = await Request.update(data, { where: { id }, returning: true });

    return updatedRequest[1][0].dataValues;
  }

  /**
   * @param {object} details trip details
   * @returns{void}
   */
  static async oneway(details) {
    const { travelDate } = details;
    const existingRequest = await Request.count({ where: { travelDate } });

    if (existingRequest) error('You\'ve already booked this trip');

    const data = await Request.create({
      ...details, tripType: 'one-way', status: 'open'
    });

    delete details.userId;

    const returnFields = Helper.pickFields(data, Object.keys(details));

    return returnFields;
  }

  /**
   * @param {object} body - arrays of request object
   * @returns {object} obej - return object
   */
  static async multiCityRequest({ body, user }) {
    const { dataValues } = await Request.create({ ...body, user_id: user.id });

    return dataValues;
  }
}
