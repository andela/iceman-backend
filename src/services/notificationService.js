import pusher from '../config/pusher';
import Notifications from '../utils/Notifications';
import Response from '../utils/response';
import sendMail from './emailService';
import { Notification, User } from '../models';


const { error } = Response;

/**
 * Notification service class
 */
export default class NotificationService {
  /**
   * @param {object} sender - sender object
   * @param {object} receiver - receiver object
   * @param {String} url - url link
   * @param {String} type - notification type
   * @return {null} - null
   */
  static async createNotificationMsg({
    sender, receiver, link, type
  }) {
    // App notification function
    const sendAppNotification = (id, title, message, url) => {
      pusher.trigger('notifications', `event-${id}`, {
        title, message, url
      });
    };

    // Email notification Function
    const sendEmailNotification = async (title, message, url) => {
      const userDetails = {
        receiver: receiver.email,
        sender: `${title} <notification@barefootnomad.com>`,
        templateName: 'notification',
        url,
        msg: message,
        name: `${sender.firstName} ${sender.lastName}`
      };

      await sendMail(userDetails);
    };

    const notificationMessage = Notifications(type, sender, link);
    const { title, message, url, } = notificationMessage;

    await Notification.create({
      message,
      url,
      senderId: sender.id,
      receiverId: receiver.id,
      type
    });

    if (receiver.emailNotify) {
      await sendEmailNotification(title, message, url);
    }

    await sendAppNotification(receiver.id, title, message, url);
  }

  /**
   *
   * @param {object} req request object
   * @returns {String} reponse message
   */
  static async optEmailNotification(req) {
    const { id } = req.user;
    const { emailNotification } = req.body;

    const data = await User.findOne({ where: { id } });

    if (!data) error('User not Found');

    await User.update({ emailNotify: emailNotification }, { where: { id } });

    return 'Email Notification status successfully updated';
  }

  /**
   * @param {object} req request object
   * @returns {String} reponse message
   */
  static async getNotification(req) {
    const { id } = req.user;
    const { notificationId } = req.params;

    const value = await Notification.update({ isRead: true },
      {
        where: {
          receiverId: id,
          id: Number(notificationId)
        }
      });

    if (value[0] !== 1) error('Notification Not Found');

    const data = await Notification.findOne({
      where: {
        id: Number(notificationId),
        receiverId: id
      }
    });

    return data;
  }

  /**
   * @param {object} req request object
   * @returns {String} reponse message
   */
  static async getAllUserNotification(req) {
    const { id } = req.user;
    const data = await Notification.findAll({ where: { receiverId: id } });

    if (!data[0]) error('No notification Found');

    return data;
  }

  /**
   * @param {object} req request object
   * @returns {String} reponse message
   */
  static async markAllRead(req) {
    const { id } = req.user;

    const isExist = await Notification.findAll({ where: { receiverId: id, isRead: false } });

    if (!isExist[0]) error('No Unread Notification Found');

    await Notification.update({ isRead: true }, { where: { receiverId: id } });

    return 'All Notification Marked As Read';
  }

  /**
   * @param {object} req request object
   * @returns {String} reponse message
   */
  static async deleteAllNotification(req) {
    const { id } = req.user;

    const isExist = await Notification.findAll({ where: { receiverId: id } });

    if (!isExist[0]) error('No Notification Found');

    await Notification.destroy({ where: { receiverId: id } });

    return 'Notification Cleared';
  }
}
