import { badRequest } from '../utils/response';
import { Accommodation, Request } from '../models';

/**
 * check booking parameters
 * @param {object} params - url parameter
 * @param {object} res - respone
 * @param {object} next - next
 * @returns {object } error message
 */
export const checkBooking = async ({ params }, res, next) => {
  const { requestId, accommodationId } = params;

  const existingRequest = await Request.count({ where: { requestId } });

  if (!existingRequest) badRequest(res, 'You have not made a vaild request');

  const existingAccommodation = await Accommodation.count({ where: { accommodationId } });

  if (!existingAccommodation) badRequest(res, 'You have not selected an existing accommodation');

  next();
};
