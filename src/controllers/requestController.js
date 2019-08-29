import RequestService from '../services/requestService';

/**
 * Class for Requests
 */
export default class RequestController {
/**
 * Update a pending trip request
 * @param {*} req - requset object
 * @param {*} res - response object
 * @return {json} - json
 */
  static async updateRequest(req, res) {
    const data = req.body;
    const { id } = req.params;
    try {
      if (data.tripType !== 'return') data.returnDate = null;

      const result = await RequestService.updateRequest(Number(id), data);

      res.status(200).json({ status: 'success', data: result });
    } catch ({ message: error }) {
      res.status(400).json({ status: 'error', error });
    }
  }
}
