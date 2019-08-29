import RequestServices from '../services/requestService';

/**
 * Class for managing trip request
 */
export default class RequestController {
  /**
   * @param {req} req - request obiect
   * @param {res} res - res object object
   * @returns {object} - return object
   */
  static async multiCityRequest(req, res) {
    try {
      const data = await RequestServices.multiCityRequest(req);
      res.status(200).json({ status: 'success', data });
    } catch ({ message: error }) {
      res.status(200).json({ status: 'success', error });
    }
  }
}
