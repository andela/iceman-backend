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
  static async addCentre({ body, file, user }) {
    if (!file) error('Please upload a valid image');

    const result = await Accommodation.findOne({ where: { name: body.name, userId: user.id } });

    if (result) error('This centre already exists');

    const res = await cloudinary.v2.uploader.upload(file.path);

    body.image = res.secure_url;

    return Accommodation.create({ ...body, userId: user.id });
  }

  /**
 * @param {string} body - valid data object of a centre
 * @param {string} files - valid images of the centre
 * @param {string} user - login user with privelleges to create centre
 * @return {object} - send back newly added room
 */
  static async addRoom({ body, files, params }) {
    if (files.length < 1) error('Please upload a valid image(s)');

    const { accommodationId } = params;
    const result = await Room.findOne({ where: { name: body.name, accommodationId } });

    if (result) error('This room already exists');

    const res = await uploadImages(files);

    body.facilities = body.facilities.split(',');
    body.images = res;

    const { dataValues } = await Room.create({ ...body, accommodationId });

    await Accommodation.increment(['roomsCount'], { where: { id: accommodationId } });

    return dataValues;
  }

  /**
 * @returns {object} - response with all accommodation
 */
  static async getAllAccommodation() {
    const result = await Accommodation.findAll({ include: [Room, Like, Feedback] });

    return result.length > 0 ? result : error('There are no accommodation');
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
