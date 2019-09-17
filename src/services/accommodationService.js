import { Op } from 'sequelize';
import cloudinary from 'cloudinary';
import Response from '../utils/response';
import uploadImages from '../utils/uploadFiles';
import {
  Accommodation, Room, Like, Feedback
} from '../models';

const { error } = Response;

/**
 * Class for booking accommodation
 */
export default class AccommodationService {
/**
 * @param {string} body - valid data object of a centre
 * @param {string} file - valid image of the centre
 * @param {string} user - login user with privelleges to create centre
 * @return {object} - send back newly created centre
 */
  static async createAccommodation({ body, file, user }) {
    if (!file) error('Please upload a valid image');

    const result = await Accommodation.findOne({
      where: { name: { [Op.iLike]: `%${body.name}` }, userId: user.id }
    });

    if (result) error('This centre already exists');

    const res = await cloudinary.v2.uploader.upload(file.path);

    body.image = res.secure_url;

    return Accommodation.create({ ...body, userId: user.id });
  }

  /**
   * @param {object} req - valid data object of a centre
   * @return {object} - send back newly created centre
   */
  static async updateAccommodation(req) {
    const {
      body,
      file,
      user: { id: userId },
      params: { id }
    } = req;

    const result = await Accommodation.findOne({ where: { id, userId } });

    if (!result) error('You cannot edit this accommodation');

    if (file) {
      const res = await cloudinary.v2.uploader.upload(file.path);
      body.image = res.secure_url;
    }

    const response = await Accommodation.update(body, { where: { id }, returning: true });

    return response[1][0];
  }

  /**
   * @param {object} user - valid user object containing the login user details
   * @param {object} params - it contains the id of the accommodation to be deleted
   * @return {object} - send back newly created centre
   */
  static async deleteAccommodation({ user, params }) {
    const result = await Accommodation.destroy({ where: { id: params.id, userId: user.id } });

    return result === 1 ? 'The accommodation has been deleted successfully' : error('You cannot delete this accommodation');
  }

  /**
 * @param {string} body - valid data object of a centre
 * @param {string} files - valid images of the centre
 * @param {string} user - login user with privelleges to create centre
 * @return {object} - send back newly added room
 */
  static async createRoom({ body, files, params }) {
    if (files.length < 1) error('Please upload a valid image(s)');

    const { accommodationId } = params;
    const result = await Room.findOne({
      where: { name: { [Op.iLike]: `%${body.name}` }, accommodationId }
    });

    if (result) error('This room already exists');

    const res = await uploadImages(files);

    body.facilities = body.facilities.split(',');
    body.images = res;

    const { dataValues } = await Room.create({ ...body, accommodationId });

    await Accommodation.increment(['roomsCount'], { where: { id: accommodationId } });

    return dataValues;
  }

  /**
   * @param {object} req - valid data object of a centre
   * @return {object} - send back updated room
   */
  static async updateRoom(req) {
    const {
      body,
      files,
      params: { id }
    } = req;

    const result = await Room.findOne({ where: { id } });

    if (!result) error('The room does not exists');

    if (files.length > 0) {
      const res = await uploadImages(files);

      body.image = res;
    }

    body.facilities = body.facilities.split(',');

    const response = await Room.update(body, { where: { id }, returning: true });

    return response[1][0];
  }

  /**
   * @param {object} user - valid user object containing the login user details
   * @param {object} params - it contains the id of the accommodation to be deleted
   * @return {object} - send back newly created centre
   */
  static async deleteRoom({ params: { id } }) {
    const result = await Room.destroy({ where: { id } });

    return result === 1 ? 'The room has been deleted successfully' : error('The operation was not successfully');
  }

  /**
 * @returns {object} - response with all accommodation
 */
  static async getAllAccommodation() {
    const result = await Accommodation.findAll({ include: [Room, Like, Feedback] });

    return result.length > 0 ? result : error('There are no accommodation yet');
  }

  /**
   * @param {number} accommodationId - ID of specified accommodation centre
   * @param {number} id - ID of logged in user
   * @return {object} - Server response
   */
  static async likeAccommodation({ params: { accommodationId }, user: { id } }) {
    const centreExists = await Accommodation.count({ where: { id: accommodationId } });

    if (!centreExists) error('This accommodation centre does not exist');

    const isLiked = await Like.count({ where: { accommodationId, userId: id } });

    if (isLiked) error('You\'ve already liked this centre');

    const { dataValues } = await Like.create({ userId: id, accommodationId });

    return dataValues;
  }

  /**
   * @param {number} accommodationId - ID of specified accommodation centre
   * @param {number} id - ID of logged in user
   * @return {object} - Server response
   */
  static async unlikeAccommodation({ params: { accommodationId }, user: { id } }) {
    const centreExists = await Accommodation.count({ where: { id: accommodationId } });

    if (!centreExists) error('This accommodation centre does not exist');

    const isLiked = await Like.count({ where: { accommodationId, userId: id } });

    if (!isLiked) error('You\'ve already unliked this centre');

    const response = await Like.destroy({ where: { accommodationId, userId: id } });

    return response;
  }

  /**
   * @param {string} comment - Feedback comment
   * @param {number} accommodationId - ID of specified accommodation centre
   * @param {number} id - ID of logged in user
   * @return {object} - Server response
   */
  static async addFeedback({
    body: { comment },
    params: { accommodationId },
    user: { id }
  }) {
    const centreExists = await Accommodation.count({ where: { id: accommodationId } });

    if (!centreExists) error('This accommodation centre does not exist');

    const { dataValues } = await Feedback.create({ comment, accommodationId, userId: id });

    return dataValues;
  }

  /**
   * @param {number} feedbackId - ID of specified feedback comment
   * @param {number} id - ID of logged in user
   * @returns {object} - Server response
   */
  static async removeFeedback({ params: { feedbackId }, user: { id } }) {
    const feedback = await Feedback.findOne({ where: { id: feedbackId } });

    if (!feedback) error('This feedback comment does not exist');

    const { userId } = feedback;

    if (userId !== id) error('You are not allowed to delete this feedback comment');

    const response = await Feedback.destroy({ where: { id: feedbackId } });

    return response;
  }
}
