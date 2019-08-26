import Joi from '@hapi/joi';

/**
  * Input validation logic
  * @param {object} schema - schema to be used for input validation
  * @param {string} property - property to be validated
  * @return {json} - validation error
  */
const validate = (schema, property) => (req, res, next) => {
  const { error } = Joi.validate(req[property], schema);
  const valid = error == null;

  if (valid) {
    next();
  } else {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }
};

export default validate;
