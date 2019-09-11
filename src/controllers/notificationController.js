import Response from '../utils/response';
import Notification from '../services/notificationService';

const { success, badRequest } = Response;
const { optEmailNotification } = Notification;
/**
 *  class for Notification
 */
export default class NotificationController {
  /**
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {Object} - response message
   */
  static async optEmail(req, res) {
    try {
      const message = await optEmailNotification(req);

      success(res, message);
    } catch ({ message: err }) {
      badRequest(res, err);
    }
  }
}
