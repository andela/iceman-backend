import Response from '../utils/response';
import Notification from '../services/notificationService';

const { success, badRequest } = Response;
const {
  optEmailNotification, getAllUserNotification, markAllRead, getNotification, deleteAllNotification
} = Notification;
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

  /**
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} - response message
   */
  static async getAllNotification(req, res) {
    try {
      const notification = await getAllUserNotification(req);

      success(res, notification);
    } catch ({ message: err }) {
      badRequest(res, err);
    }
  }

  /**
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} - response message
   */
  static async getSpecificNotification(req, res) {
    try {
      const specificNotification = await getNotification(req);

      success(res, specificNotification);
    } catch ({ message: err }) {
      badRequest(res, err);
    }
  }

  /**
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} - response message
   */
  static async markAllAsRead(req, res) {
    try {
      const mark = await markAllRead(req);

      success(res, mark);
    } catch ({ message: err }) {
      badRequest(res, err);
    }
  }

  /**
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} - response message
   */
  static async clearAllNotification(req, res) {
    try {
      const mark = await deleteAllNotification(req);

      success(res, mark);
    } catch ({ message: err }) {
      badRequest(res, err);
    }
  }
}
