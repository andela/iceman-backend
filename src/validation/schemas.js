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
