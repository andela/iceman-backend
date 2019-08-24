import Joi from '@hapi/joi';

/**
 * Input validation logic
 * @param {object} schema - schema to be used for input validation
 * @return {json} - validation error
 */
const validate = schema => (req, res, next) => {
  const { error } = Joi.validate(req.body, schema);
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
