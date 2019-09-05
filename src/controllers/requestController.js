import RequestService from '../services/requestService';
import Response from '../utils/response';

const { success, badRequest } = Response;
const {
  updateRequest, getRequest, rejectRequest, oneway,
} = RequestService;

/**
 * Class for Requests
 */
export default class RequestController {
/**
 * Update a pending trip request
 * @param {object} req - request object
 * @param {object} res - response object
 * @return {json} - json
 */
  static async update(req, res) {
    const data = req.body;
    const { requestId } = req.params;
    const { id } = req.decoded;

    try {
      const userRequest = await getRequest(requestId);
      const { userId } = userRequest;

      if (userId !== id) return badRequest(res, 'You are not allowed to edit this request', 403);

      if (data.tripType !== 'return') data.returnDate = null;

      const result = await updateRequest(Number(requestId), data);

      success(res, result);
    } catch ({ message: err }) {
      badRequest(res, err);
    }
  }

  /**
 * @param {object} body request body
 * @param {object} res response body
 * @returns {object} res
 */
  static async oneWay({ body, decoded }, res) {
    const { id: userId } = decoded;

    try {
      const data = await oneway(body, userId);

      success(res, data, 201);
    } catch ({ message: err }) {
      badRequest(res, err, 409);
    }
  }

  /**
 * View a trip request
 * @param {object} req - request object
 * @param {object} res - response object
 * @return {json} - json
 */
  static async getRequest({ params, decoded }, res) {
    const { requestId } = params;
    const { id } = decoded;

    try {
      const userRequest = await getRequest(parseInt(requestId, 10));
      const { userId } = userRequest;

      if (userId !== id) return badRequest(res, 'You are not allowed to view this request', 403);

      success(res, userRequest);
    } catch ({ message: err }) {
      badRequest(res, err);
    }
  }

  /**
 * Update a pending trip request
 * @param {object} req - request object
 * @param {object} res - response object
 * @return {json} - json
 */
  static async reject({ params, decoded }, res) {
    const { requestId } = params;
    const { id } = decoded;

    try {
      const userRequest = await getRequest(parseInt(requestId, 10));
      const { userId } = userRequest;

      if (userId !== id) return badRequest(res, 'You are not allowed to reject this request', 403);

      const result = await rejectRequest(parseInt(requestId, 10));

      success(res, result);
    } catch ({ message: err }) {
      badRequest(res, err);
    }
  }
}
