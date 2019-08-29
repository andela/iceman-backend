import jwt from 'jsonwebtoken';
import Response from '../utils/response';

const { badRequest } = Response;

/**
  * Input validation logic
  * @param {object} req - request object
  * @param {object} res - response object
  * @param {object} next - the next middleware function in the route
  * @return {json} - authorization error
  */
const jwtSecret = process.env.JWTSECRET;
export default async (req, res, next) => {
  const token = req.header('token') || req.header('Authorization');
  if (!token) return badRequest(res, 'Access Denied, No token provided', 401);
  try {
    const payload = await jwt.verify(token, jwtSecret);
    req.user = payload;
    next();
  } catch (error) {
    badRequest(res, 'Access Denied, Invalid token');
  }
};
