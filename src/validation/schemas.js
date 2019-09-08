import Joi from '@hapi/joi';

Joi.extend(require('@hapi/joi-date'));

/**
 * user schema to be used for validating user input
 */
export const signUpSchema = Joi.object().keys({
  firstName: Joi.string().trim().required()
    .error(() => ({
      message: 'First Name is required'
    })),
  lastName: Joi.string().trim().required()
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
 * profile schema to be used for validating user profile
 */
export const profileSchema = Joi.object().keys({
  firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  gender: Joi.string().trim().optional(),
  preferredLanguage: Joi.string().trim().optional(),
  residentialAddress: Joi.string().trim().optional(),
  preferredCurrency: Joi.string().trim().optional(),
  dateOfBirth: Joi.date().optional(),
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
 * user schema to be used for validating user login credential
 */
export const LogInSchema = Joi.object().keys({
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
  * Role schema to assign roles to user
  */
export const roleSchema = Joi.object().keys({
  email: Joi.string().email().trim().lowercase()
    .required()
    .error(() => ({
      message: 'Email must be a valid email address e.g example@mail.com or example@mail.co.uk',
    })),
  roleId: Joi.number().min(1).max(5)
    .required()
    .error(() => ({
      message: 'Invalid Role Input',
    })),
});

/**
<<<<<<< HEAD
 * Schema for request ID
 */
export const requestIdSchema = Joi.object().keys({
  requestId: Joi.number().integer().min(1).required()
    .error(() => ({
      message: 'Request ID must be an integer greater than or equal to 1',
    })),
});

/**
 * Schema for validating multi city request
 */
export const requestSchema = Joi.object().keys({
  source: Joi.string().required().error(() => ({ message: 'Source is required' })),
  tripType: Joi.string().required().error(() => ({ message: 'Please select your trip type. Should be one-way, return or multi-city' })),
  destination: Joi.string().required().error(() => ({ message: 'Please select your destination(s)' })),
  travelDate: Joi.date().required().error(() => ({ message: 'Travel date is required e.g YYYY-MM-DD' })),
  returnDate: Joi.date(),
  reason: Joi.string(),
  status: Joi.string(),
  accommodation: Joi.string()
});
