import Joi from '@hapi/joi';

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
 * Schema for validating multi city request
 */
export const requestSchema = Joi.object().keys({
  source: Joi.string().required().error(() => ({ message: 'Source is required' })),
  tripType: Joi.string().required().error(() => ({ message: 'Please select your trip type. Should be oneway, return or multicity' })),
  destination: Joi.string().required().error(() => ({ message: 'Please select your destination(s)' })),
  travelDate: Joi.date().required().error(() => ({ message: 'Travel date is required e.g YYYY-MM-DD' })),
  returnDate: Joi.date(),
  reason: Joi.string().required().error(() => ({ message: 'Reason is required' })),
  status: Joi.string(),
  accommodation: Joi.string().required().error(() => ({ message: 'Accommodation is required' }))
});

/**
 * Schema for validating centre
 */
export const accommodationSchema = Joi.object().keys({
  name: Joi.string().required().error(() => ({ message: 'Please provide the centre name' })),
  country: Joi.string().required().error(() => ({ message: 'Please select country of the centre' })),
  state: Joi.string().required().error(() => ({ message: 'Please select state of the centre' })),
  city: Joi.string().required().error(() => ({ message: 'Please select city of the centre' })),
  address: Joi.string().required().error(() => ({ message: 'Please provide the centre address' })),
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
