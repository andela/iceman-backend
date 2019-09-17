import BookingService from '../services/bookingService';
import Response from '../utils/response';

const { book, viewBooking } = BookingService;

const { badRequest, success } = Response;

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
  static async createBooking(req, res) {
    try {
      const data = await book(req);

      success(res, data);
    } catch ({ message: err }) {
      badRequest(res, err);
    }
  }

  /**
     *
     * @param {object} req - request
     * @param {object} res - response message
     * @returns {object} - response data
     */
  static async viewBookings(req, res) {
    try {
      const data = await viewBooking(req);

      success(res, data);
    } catch ({ message: err }) {
      badRequest(res, err);
    }
  }
}
