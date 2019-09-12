import { Booking, Accommodation } from '../models';
import { error } from '../utils/response';

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

    const existingBooking = await Request.count({ where: { requestId, userId: id } });

    if (existingBooking) error('You\'ve already booked this accommodation');

    const { dataValues } = await Booking.create({ ...body, userId: id });

    await Accommodation.decrement(['roomsCount'], { where: { id: accommodationId } });

    return dataValues;
  }
}
