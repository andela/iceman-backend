import jwt from 'jsonwebtoken';
import Response from '../utils/response';

const { badRequest } = Response;

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
