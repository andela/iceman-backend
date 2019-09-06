import RequestService from '../services/requestService';
import Response from '../utils/response';

const { success, badRequest } = Response;
<<<<<<< HEAD
const { updateRequest, multiCityRequest, getRequests } = RequestService;
=======
const {
  updateRequest, multiCityRequest, myRequests, getOpenRequest
} = RequestService;
>>>>>>> implement availing request logic

/**
 * Class for Requests
 */
export default class RequestController {
  /**
 * Update a pending trip request
 * @param {object} req - requset object
 * @param {object} res - response object
 * @return {json} - json
 */
  static async update(req, res) {
    try {
      const result = await updateRequest(req);

      success(res, result);
    } catch ({ message: err }) {
      badRequest(res, err);
    }
  }

  /**
 * @param {object} req request object
 * @param {object} res response object
 * @returns {object} res
 */
  static async oneWay(req, res) {
    try {
      const data = await RequestService.oneway(req);

      success(res, data, 201);
    } catch ({ message: err }) {
      badRequest(res, err, 409);
    }
  }

  /**
   * @param {req} req - request obiect
   * @param {res} res - res object object
   * @returns {object} - return object
   */
  static async multiCityRequest(req, res) {
    try {
      const data = await multiCityRequest(req);

      success(res, data);
    } catch ({ message: err }) {
      badRequest(res, err);
    }
  }

  /**
   * @param {req} req - request obiect
   * @param {res} res - res object object
   * @returns {object} - return object
   */
  static async getRequests(req, res) {
    try {
      const data = await getRequests(req);

      success(res, data);
    } catch ({ message: err }) {
      badRequest(res, err, 404);
    }
  }

  /**
   * @param {object} req - request object
   * @param {object} res - response object
   * @return {json} - open requests
   */
  static async openRequests(req, res) {
    const { line_manager } = req.decoded;
    try {
      const result = await getOpenRequest(line_manager);

      success(res, result);
    } catch ({ message: err }) {
      badRequest(res, err, 404);
    }
  }
}
