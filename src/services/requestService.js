import { sequelize, Request } from '../models';
import Response from '../utils/response';

const { error } = Response;

/**
 * Request service class
 */
export default class RequestService {
  /**
  * update trip rquest
  * @param {number} id - request id
  * @param {object} data - request object
  * @return {object} - updated request
  */
  static async updateRequest({ body, params, user: { id } }) {
    const userRequest = await Request.findOne({ where: { id: params.requestId } });

    if (!userRequest) error('Trip request not found');

    const { userId, status } = userRequest;

    if (userId !== id) error('You are not allowed to edit this request');

    if (body.tripType === 'one-way') body.returnDate = null;

    if (status !== 'open') error(`Request has been ${status}. cannot edit`);

    body.destination = body.destination.split(',');

    const updatedRequest = await Request.update(body, {
      where: { id: params.requestId },
      returning: true
    });

    return updatedRequest[1][0].dataValues;
  }

  /**
   * @param {object} details trip details
   * @returns{void}
   */
  static async oneway({ body, user: { id } }) {
    const { travelDate } = body;
    const existingRequest = await Request.count({ where: { travelDate, userId: id } });

    if (existingRequest) error('You\'ve already booked this trip');

    body.destination = body.destination.split(',');

    return Request.create({ ...body, userId: id });
  }

  /**
   * @param {object} body - arrays of request object
   * @returns {object} obej - return object
   */
  static async multiCityRequest({ body, user: { id } }) {
    const { travelDate } = body;
    const destination = body.destination.split(',');

    if (destination.length <= 1) error('Request must be more than one');

    const existingRequest = await Request.count({ where: { travelDate, userId: id } });

    if (existingRequest) error('You\'ve already booked this trip');

    if (body.tripType !== 'multi-city') error('Trip type must be mulit city');

    const { dataValues } = await Request.create({ ...body, destination, userId: id });

    return dataValues;
  }

  /**
   * @param {object} body - arrays of request object
   * @returns {object} obej - return object
   */
  static async getRequests({ user: { id } }) {
    const result = await Request.findAll({ where: { userId: id } });

    if (result.length === 0) error('You\'ve not make any requests');

    return result;
  }

  /**
   *
   * @param {number} id - manager's id
   * @return {obeject} - open requests
   */
  static async getOpenRequest({ user: { id } }) {
    const strQuery = 'SELECT A.source, A.destination, A.travelDate, A.returnDate, '
      + ' A.status, A.tripType, A.reason, A.accommodation, B.firstName, B.lastName FROM Requests A '
      + ' INNER JOIN Users B ON B.id = A.userId INNER JOIN UserDepartments C ON C.userId = B.Id '
      + " INNER JOIN Departments D ON D.id = C.departmentId WHERE A.status='open' AND D.manager=:id";

    const openRequests = sequelize.query(strQuery, {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT
    });

    if (openRequests.length < 1) error('There are no pending requests');

    return openRequests;
  }
}
