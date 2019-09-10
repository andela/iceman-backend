<<<<<<< HEAD
import { Op } from 'sequelize';
import {
  Request, User, UserDepartment, Department
} from '../models';
=======
import { Request } from '../models';
>>>>>>> feature(requests): setup travel request response
import Response from '../utils/response';
import Helper from '../utils/helpers';

const { error } = Response;

/**
 * Request service class
 */
export default class RequestService {
  /**
<<<<<<< HEAD
  * update trip rquest
=======
   * Getting a request
   * @param {number} id -request id
   * @return {object} - request object
   */
  static async getRequest(id) {
    const userRequest = await Request.findOne({ where: { id }, returning: true });

    if (!userRequest) error('Trip request not found');

    return userRequest;
  }

  /**
  * update trip request
>>>>>>> feature(requests): setup travel request rejection
  * @param {number} id - request id
  * @param {object} data - request object
  * @return {object} - updated request
  */
  static async updateRequest({ body, params, user: { id } }) {
    const userRequest = await Request.findOne({ where: { id: params.requestId } });

<<<<<<< HEAD
    if (!userRequest) error('Trip request not found');

    const { userId, status } = userRequest;

    if (userId !== id) error('You are not allowed to edit this request');

    if (body.tripType === 'one-way') body.returnDate = null;
=======
    const { status } = userRequest;
>>>>>>> feature(requests): setup travel request rejection

    if (status !== 'open') error(`Request has been ${status}. cannot edit`);

    body.destination = body.destination.split(',');

    const updatedRequest = await Request.update(body, {
      where: { id: params.requestId },
      returning: true
    });

    return updatedRequest[1][0].dataValues;
  }

  /**
<<<<<<< HEAD
=======
  * update trip request
  * @param {number} id - request id
  * @param {object} data - request object
  * @return {object} - updated request
  */
  static async respondToRequest({ body: { status }, params: { requestId }, user: { id } }) {
    const userRequest = await Request.findOne({ where: { id: requestId } });

    if (!userRequest) error('Trip request not found');

    if (status !== 'approved' && status !== 'rejected') error('Response status must be approved or rejected');

    if (userRequest.userId === id) error('You cannot respond to your own request');

    const isDownlinesRequest = await Request.findOne({
      where: { id: requestId },
      include: Helper.mapToDepartment(id)
    });

    if (!isDownlinesRequest) error('This request is not from your direct report');

    const [, [{ dataValues }]] = await Request.update({ status }, {
      where: { id: requestId }, returning: true
    });

    return dataValues;
  }

  /**
>>>>>>> feature(requests): setup travel request response
   * @param {object} details trip details
   * @param {number} userId ID of the user creating the request
   * @returns{void}
   */
<<<<<<< HEAD
  static async oneway({ body, user: { id } }) {
    const { travelDate } = body;
    const destination = body.destination.split(',');

    if (destination.length > 1) error('Request destination must one');

    const existingRequest = await Request.count({ where: { travelDate, userId: id } });

    if (existingRequest) error('You are not allowed to make multiple request');

    body.tripType = 'one-way';

    return Request.create({ ...body, destination, userId: id });
  }

  /**
   * @param {object} body - arrays of request object
   * @returns {object} obej - return object
   */
  static async multiCityRequest({ body, user: { id } }) {
    const { travelDate } = body;
    const destination = body.destination.split(',');

    if (destination.length <= 1) error('Request destination must be more than one');

    if (!body.returnDate) error('Return date is required');

    const existingRequest = await Request.count({ where: { travelDate, userId: id } });

    if (existingRequest) error('You are not allowed to make multiple request');

    body.tripType = 'multi-city';

    const { dataValues } = await Request.create({ ...body, destination, userId: id });

    return dataValues;
  }

  /**
   * @param {object} body - arrays of request object
   * @returns {object} obj - return object
   */
  static async getRequests({ user: { id } }) {
    const result = await Request.findAll({ where: { userId: id } });
=======
  static async oneway(details, userId) {
    const { travelDate } = details;
    const existingRequest = await Request.count({ where: { travelDate } });
>>>>>>> feature(requests): setup travel request rejection

    if (result.length === 0) error('You\'ve not made any requests');

<<<<<<< HEAD
    return result;
  }

  /**
   *
   * @param {number} id - manager's id
   * @return {object} - open requests
   */
  static async availOpenRequests({ user: { id } }) {
    const openRequests = await Request.findAll({
      where: { status: 'open' },
<<<<<<< HEAD
      include: [{
        model: User,
        required: true,
        attributes: ['firstName', 'lastName'],
        include: [
          {
            model: UserDepartment,
            required: true,
            attributes: ['departmentId'],
            include: [
              {
                model: Department,
                where: { manager: id },
                required: true,
                attributes: ['department', 'manager']
              }
            ]
          },
        ]
      }]
=======
    const data = await Request.create({
      ...details, tripType: 'one-way', status: 'open', userId,
>>>>>>> feature(requests): setup travel request rejection
=======
      include: Helper.mapToDepartment(id)
>>>>>>> feature(requests): setup travel request response
    });

    if (openRequests.length < 1) error('There are no pending requests');

    return openRequests;
  }

  /**
   * @param {object} details - user trip details
   * @returns {object} trip - details
   */
  static async returnRequest({ body, user: { id } }) {
    const { travelDate } = body;

    const existingRequest = await Request.count({ where: { travelDate, userId: id } });

    if (body.tripType !== 'return') error('Trip type must be return trip');

    if (!body.returnDate) error('Return date is required');

    if (existingRequest) error('You are not allowed to make multiple request');

    body.destination = body.destination.split(',');

    if (body.destination.length > 1) error('Return trip allow only one destination');

    const { dataValues } = await Request.create({ ...body, userId: id });

    return dataValues;
  }

  /**
   *
   * @param {object} query - search object
   * @returns {object} data
   */
  static async search(query) {
    const {
      id, userId, destination, source, status
    } = query;

    const data = await Request.findAll({
      where: {
        [Op.or]: [
          id ? { id: { [Op.eq]: `${id}` } } : null,
          userId ? { userId: { [Op.eq]: `${userId}` } } : null,
          destination ? { destination: { [Op.contains]: [`${Object.values(query)[0]}`] } } : null,
          source ? { source: { [Op.iLike]: `%${Object.values(query)[0]}%`, } } : null,
          status ? { status: { [Op.iLike]: `%${Object.values(query)[0]}%`, } } : null
        ]
      },
    });

    if (data.length === 0) error('No result found');

    return data;
  }

  /**
  * update trip request
  * @param {number} id - request id
  * @param {object} data - request object
  * @return {object} - updated request
  */
  static async rejectRequest(id) {
    const [, [{ dataValues }]] = await Request.update({ status: 'rejected' }, { where: { id }, returning: true });

    return dataValues;
  }
}
