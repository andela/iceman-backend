import RequestService from '../services/requestService';
import Response from '../utils/response';

const { success, badRequest } = Response;
const { updateRequest } = RequestService;

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
    const data = req.body;
    const { id } = req.params;

    try {
      if (data.tripType !== 'return') data.returnDate = null;

      const result = await updateRequest(Number(id), data);

      success(res, result);
    } catch ({ message: error }) {
      badRequest(res, error);
    }
  }
}
