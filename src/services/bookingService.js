import cloudinary from 'cloudinary';
import Response from '../utils/response';
import uploadImages from '../utils/uploadFiles';
import { Centre, Room } from '../models';


const { error } = Response;

/**
 * Class for booking accommodation
 */
export default class BookingService {
/**
 * @param {string} body - valid data object of a centre
 * @param {string} file - valid image of the centre
 * @param {string} user - login user with privelleges to create centre
 * @return {object} - send back newly created centre
 */
  static async addCentre({ body, file, user }) {
    if (!file) error('Please upload a valid image');

    const result = await Centre.findOne({ where: { name: body.name, userId: user.id } });

    if (result) error('This centre already exists');

    const res = await cloudinary.v2.uploader.upload(file.path);

    body.image = res.secure_url;

    return Centre.create({ ...body, userId: user.id });
  }

  /**
 * @param {string} body - valid data object of a centre
 * @param {string} files - valid images of the centre
 * @param {string} user - login user with privelleges to create centre
 * @return {object} - send back newly added room
 */
  static async addRoom({ body, files, params }) {
    if (files.length < 1) error('Please upload a valid image(s)');

    const { centreId } = params;
    const result = await Room.findOne({ where: { name: body.name, centreId } });

    if (result) error('This room already exists');

    const res = await uploadImages(files);

    body.facilities = body.facilities.split(',');
    body.images = res;

    const { dataValues } = await Room.create({ ...body, centreId });

    await Centre.increment(['roomsCount'], { where: { id: centreId } });

    return dataValues;
  }
}
