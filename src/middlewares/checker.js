import Response from '../utils/response';
import { Accommodation, Request } from '../models';

const { badRequest, error } = Response;
/**
 * check booking parameters
 * @param {object} params - url parameter
 * @param {object} res - respone
 * @param {object} next - next
 * @returns {object } error message
 */
export const checkBooking = async ({ params, user }, res, next) => {
  try {
    const { requestId, accommodationId } = params;

    const existingRequest = await Request.count({ where: { id: +requestId, userId: user.id } });

    if (!existingRequest) error('You don\'t a vaild request');

    const existingAccommodation = await Accommodation.count({ where: { id: +accommodationId } });

    if (!existingAccommodation) error('You have not selected an existing accommodation');

    next();
  } catch ({ message: err }) {
    badRequest(res, err);
  }
};
