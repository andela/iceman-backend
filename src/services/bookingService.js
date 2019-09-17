import { Booking, Accommodation, Room } from '../models';
import Response from '../utils/response';

const { error } = Response;

/**
 * Booking services
 */
export default class BookingService {
  /**
     *
     * @param {object} data - booking data
     * @returns {object} response
     */
  static async book({ body, params, user: { id } }) {
    const { requestId, accommodationId } = params;

    const { roomId } = body;

    const existingBooking = await Booking.count({ where: { userId: id, requestId } });

    if (existingBooking) error('You\'ve already book an accommodation for this trip');

    const checkRoom = await Room.findOne({ where: { id: roomId, status: 'available' } });

    if (!checkRoom) error('Selected room is already booked');

    const { dataValues } = await Booking.create({
      ...body, userId: id, requestId, accommodationId
    });

    await Accommodation.decrement(['roomsCount'], { where: { id: accommodationId } });

    await Room.update({ status: 'booked' }, { where: { id: roomId } });

    return dataValues;
  }

  /**
   *
   * @param {integer} id  -user id
   * @returns {object} - booking details
   */
  static async viewBooking({ user: { id } }) {
    const result = await Booking.findAll({ where: { userId: id } });

    if (result.length === 0) error('You\'ve not book any accommodation');

    return result;
  }
}
