import BookingService from '../services/bookingService';
import { badRequest, success } from '../utils/response';

const { book } = BookingService;

/**
 * Class for booking
 */
export default class BookingController {
  /**
     *
     * @param {object} req - request
     * @param {object} res - response message
     * @returns {object} - response data
     */
  static async book(req, res) {
    try {
      const data = book(req);

      success(res, data);
    } catch (error) {
      badRequest(res, error);
    }
  }
}
