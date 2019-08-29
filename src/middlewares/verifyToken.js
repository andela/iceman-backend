import jwt from 'jsonwebtoken';

/**
 * @param {object} req request body
 * @param {object} res response body
 * @param {function} next middleware next call
 * @return {function} next middleware next call
 */
export default ({ headers, body }, res, next) => {
  try {
    const { token } = headers;
    const data = jwt.verify(token, process.env.JWTSECRET);

    body.userId = data.id;

    next();
  } catch ({ message: error }) {
    res.status(401).send({
      status: 'error',
      error
    });
  }
};
