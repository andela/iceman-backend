import Response from '../utils/response';
import AccommodationService from '../services/accommodationService';

const { success, badRequest, successMessage } = Response;
const {
  createAccommodation,
  createRoom,
  getAllAccommodation,
  updateAccommodation,
  deleteAccommodation,
  updateRoom,
  deleteRoom,
  likeAccommodation,
  unlikeAccommodation,
  addFeedback,
  removeFeedback
} = AccommodationService;

/**
 * Booking Controller Class
 */
export default class AccommodationController {
/**
 * @param {object} req - request object
 * @param {object} res - response object
 * @return {object} return object containing status and data
 */
  static async createAccommodation(req, res) {
    try {
      const data = await createAccommodation(req);

      success(res, data);
    } catch ({ message: error }) {
      badRequest(res, error);
    }
  }

  /**
 * @param {object} req - request object
 * @param {object} res - response object
 * @return {object} - return object containing status and data
 */
  static async createRoom(req, res) {
    try {
      const data = await createRoom(req);

      success(res, data);
    } catch ({ message: error }) {
      badRequest(res, error);
    }
  }

  /**
 * @param {object} req - request object
 * @param {object} res - response object
 * @return {object} - return object containing status and data
 */
  static async getAllAccommodation(req, res) {
    try {
      const data = await getAllAccommodation();

      success(res, data);
    } catch ({ message: error }) {
      badRequest(res, error);
    }
  }

  /**
 * @param {object} req - request object
 * @param {object} res - response object
 * @return {object} - return object containing status and data
 */
  static async likeAccommodation(req, res) {
    try {
      const data = await likeAccommodation(req);

      success(res, data, 201);
    } catch ({ message: error }) {
      badRequest(res, error);
    }
  }

  /**
 * @param {object} req - request object
 * @param {object} res - response object
 * @return {object} user - return object containing status and data
 */
  static async updateAccommodation(req, res) {
    try {
      const data = await updateAccommodation(req);

      success(res, data);
    } catch ({ message: error }) {
      badRequest(res, error);
    }
  }

  /**
 * @param {object} req - request object
 * @param {object} res - response object
 * @return {object} - return object containing status and data
 */
  static async unlikeAccommodation(req, res) {
    try {
      await unlikeAccommodation(req);

      successMessage(res, 'You\'ve unliked this centre successfully');
    } catch ({ message: error }) {
      badRequest(res, error);
    }
  }

  /**
 * @param {object} req - request object
 * @param {object} res - response object
 * @return {object} user - return object containing status and data
 */
  static async deleteAccommodation(req, res) {
    try {
      const data = await deleteAccommodation(req);

      successMessage(res, data);
    } catch ({ message: error }) {
      badRequest(res, error);
    }
  }

  /**
 * @param {object} req - request object
 * @param {object} res - response object
 * @return {object} - return object containing status and data
 */
  static async addFeedback(req, res) {
    try {
      const data = await addFeedback(req);

      success(res, data, 201);
    } catch ({ message: error }) {
      badRequest(res, error);
    }
  }

  /**
 * @param {object} req - request object
 * @param {object} res - response object
 * @return {object} room - return object containing status and data
 */
  static async updateRoom(req, res) {
    try {
      const data = await updateRoom(req);

      success(res, data);
    } catch ({ message: error }) {
      badRequest(res, error);
    }
  }

  /**
 * @param {object} req - request object
 * @param {object} res - response object
 * @return {object} - return object containing status and data
 */
  static async removeFeedback(req, res) {
    try {
      await removeFeedback(req);

      successMessage(res, 'You\'ve removed this feedback successfully');
    } catch ({ message: error }) {
      badRequest(res, error);
    }
  }

  /**
 * @param {object} req - request object
 * @param {object} res - response object
 * @return {string}  - return success or error message
 */
  static async deleteRoom(req, res) {
    try {
      const data = await deleteRoom(req);

      successMessage(res, data);
    } catch ({ message: error }) {
      badRequest(res, error);
    }
  }
}
