import Joi from '@hapi/joi';
import Response from '../utils/response';

/**
  * Input validation logic
  * @param {object} schema - schema to be used for input validation
  * @param {string} property - property to be validated
  * @return {json} - validation error
  */
const validate = (schema, property) => (req, res, next) => {
  const { error } = Joi.validate(req[property], schema);
  const valid = error == null;

  if (!valid) return Response.badRequest(res, error.details[0].message);

  next();
};

/**
  * Input validation logic
  * @param {object} schema - schema to be used for input validation
  * @param {string} property - property to be validated
  * @return {json} - validation error
  */
export const validator = (schema, property = 'body') => (req, res, next) => {
  const errors = Joi.validate(req[property], schema, { abortEarly: false });

  if (errors.error) {
    const errorMSG = [];

    errors.error.details.forEach(err => errorMSG.push(err.message));

    return Response.badRequest(res, errorMSG);
  }
  next();
};

export default validate;
