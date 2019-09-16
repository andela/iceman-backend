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
  middleName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  gender: Joi.string().trim().optional(),
  preferredLanguage: Joi.string().trim().optional(),
  residentialAddress: Joi.string().trim().optional(),
  preferredCurrency: Joi.string().trim().optional(),
  passportName: Joi.string().trim().optional(),
  passportNumber: Joi.string().trim().optional(),
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
    }))
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
 * Schema for request ID
 */
export const requestIdSchema = Joi.object().keys({
  requestId: Joi.number().integer().min(1).required()
    .error(() => ({
      message: 'Request ID must be an integer greater than or equal to 1',
    })),
});

/**
 * Schema for travel request response
 */
export const responseSchema = Joi.object().keys({
  status: Joi.string().trim().valid('approved', 'rejected').lowercase()
    .required()
    .error(() => ({ message: 'Please enter your response status. Should be accepted or rejected' }))
});

/**
 * Schema for validating multi city request
 */
export const requestSchema = Joi.object().keys({
  source: Joi.string().required().error(() => ({ message: 'Source is required' })),
  tripType: Joi.string(),
  destination: Joi.string().required().error(() => ({ message: 'Please select your destination(s)' })),
  travelDate: Joi.date().required().error(() => ({ message: 'Travel date is required e.g YYYY-MM-DD' })),
  returnDate: Joi.date(),
  reason: Joi.string().required().error(() => ({ message: 'Reason is required' })),
  status: Joi.string(),
  accommodation: Joi.string().required().error(() => ({ message: 'Accommodation is required' })),
  passportName: Joi.string().required().error(() => ({ message: 'passportName is Required' })),
  passportNumber: Joi.number().required().error(() => ({ message: 'passportNumber is Required' })),
  rememberProfile: Joi.boolean().required(),
  gender: Joi.string().trim().required().error(() => ({ message: 'gender is Required' })),
  preferredLanguage: Joi.string().trim().required().error(() => ({ message: 'preferredLanguage is Required' })),
  residentialAddress: Joi.string().trim().required().error(() => ({ message: 'residentialAddress is Required' })),
  preferredCurrency: Joi.string().trim().required().error(() => ({ message: 'preferredCurrency is Required' })),
});

export const commentSchema = Joi.object().keys({
  comment: Joi.string().trim().required()
    .error(() => ({
      message: 'Comment is required'
    }))
});

/**
 * Schema for validating centre
 */
export const accommodationSchema = Joi.object().keys({
  name: Joi.string().required().error(() => ({ message: 'Please provide the name of the accommodation centre' })),
  country: Joi.string().required().error(() => ({ message: 'Please provide the country were the accommodation centre is located' })),
  state: Joi.string().required().error(() => ({ message: 'Please provide the state were the accommodation centre is located' })),
  city: Joi.string().required().error(() => ({ message: 'Please provide the city were the accommodation centre is located' })),
  address: Joi.string().required().error(() => ({ message: 'Please provide the address of the accommodation centre' })),
  description: Joi.string(),
});

/**
 * Schema for validating room
 */
export const roomSchema = Joi.object().keys({
  name: Joi.string().required().error(() => ({ message: 'Please provide the room name' })),
  roomType: Joi.string().required().error(() => ({ message: 'Please select valid room type' })),
  facilities: Joi.string().required().error(() => ({ message: 'Please specify the room facilities' })),
  price: Joi.string(),
  status: Joi.string(),
  description: Joi.string(),
});
