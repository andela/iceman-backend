import Joi from '@hapi/joi';

/**
 * user schema to be used for validating user input
 */
export const signUpSchema = Joi.object().keys({
  first_name: Joi.string().trim().required()
    .error(() => ({
      message: 'First Name is required'
    })),
  last_name: Joi.string().trim().required()
    .error(() => ({
      message: 'Last Name is required'
    })),
  email: Joi.string().email().trim().lowercase()
    .required()
    .error(() => ({
      message: 'Email must be a valid email address e.g example@mail.com or example@mail.co.uk',
    })),
  password: Joi.string().regex(/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{8,20}$/).required()
    .error(() => ({
      message: 'Password must contain at least one letter, at least one number, and be atleast 8 digits long',
    })),
});

/**
 * request schema to be used for validating user input
 */
export const requestSchema = Joi.object().keys({
  source: Joi.string().trim().required()
    .error(() => ({
      message: 'Source is required'
    })),
  destination: Joi.string().trim().required()
    .error(() => ({
      message: 'Please select your destination'
    })),
  travelDate: Joi.date().required()
    .error(() => ({
      message: 'Travel date is required e.g YYYY-MM-DD',
    })),
  returnDate: Joi.date().allow(null).optional()
    .error(() => ({
      message: 'Return date should be in YYYY-MM-DD format',
    })),
  tripType: Joi.string().valid('oneway', 'return', 'multicity').lowercase().required()
    .error(() => ({
      message: 'Please select your trip type. Should be oneway, return or multicity',
    })),
  reason: Joi.string().lowercase().required()
    .error(() => ({
      message: 'Reason is required',
    })),
  accommodation: Joi.string().lowercase().required()
    .error(() => ({
      message: 'Accommodation is required',
    }))
});

/**
 * password schema to be used for validating password change
 */
export const passwordResetSchema = Joi.object().keys({
  password: Joi.string().regex(/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{8,20}$/).required()
    .error(() => ({
      message: 'Password must contain at least one letter, at least one number, and be atleast 8 digits long',
    }))
});

/**
 * Verify Email schema to be used for resending verification link
 */
export const verifyEmail = Joi.object().keys({
  email: Joi.string().email()
    .required()
    .error(() => ({
      message: 'Email must be a valid email'
    })),
});

/**
 * Schema for one way trip request
 */
export const oneWaySchema = Joi.object().keys({
  source: Joi.string().trim().required()
    .error(() => ({
      message: 'Source is required'
    })),
  destination: Joi.string().trim().required()
    .error(() => ({
      message: 'Please select your destination'
    })),
  travelDate: Joi.date().required()
    .error(() => ({
      message: 'Travel date is required e.g YYYY-MM-DD',
    })),
  reason: Joi.string().lowercase().required()
    .error(() => ({
      message: 'Reason is required',
    })),
  accommodation: Joi.string().lowercase().required()
    .error(() => ({
      message: 'Accommodation is required',
    })),
});

/**
  * Role schema to assign roles to user
  */
export const roleSchema = Joi.object().keys({
  email: Joi.string().email().trim().lowercase()
    .required()
    .error(() => ({
      message: 'Email must be a valid email address e.g example@mail.com or example@mail.co.uk',
    })),
});
