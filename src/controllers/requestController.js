import RequestService from '../services/requestService';
import Response from '../utils/response';

const { success, badRequest } = Response;

/**
 * Trip requests
 */
export default class RequestController {
/**
 * @param {object} body request body
 * @param {object} res response body
 * @returns {object} res
 */
  static async oneWay({ body }, res) {
    try {
      const data = await RequestService.oneway(body);

      success(res, data, 201);
    } catch ({ message: error }) {
      badRequest(res, error, 409);
    }
  }
}
