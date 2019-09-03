import { Request } from '../models';
import Helper from '../utils/helpers';
import Response from '../utils/response';

const { error } = Response;
/**
 * Trip request services
 */
export default class RequestService {
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
}
