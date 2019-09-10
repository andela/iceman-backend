import Response from '../utils/response';
import BookingService from '../services/accommodationService';

const { success, badRequest } = Response;
const { addCentre, addRoom } = BookingService;

/**
 * Booking Controller Class
 */
export default class AccommodationController {
/**
 * @param {object} req - request object
 * @param {object} res - response object
 * @return {object} user - return object containing status and data
 */
  static async addCentre(req, res) {
    try {
      const data = await addCentre(req);

      success(res, data);
    } catch ({ message: error }) {
      badRequest(res, error);
    }
  }

  /**
 * @param {object} req - request object
 * @param {object} res - response object
 * @return {object} user - return object containing status and data
 */
  static async addRoom(req, res) {
    try {
      const data = await addRoom(req);

      success(res, data);
    } catch ({ message: error }) {
      badRequest(res, error);
    }
  }
}