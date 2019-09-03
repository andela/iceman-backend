import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Response from '../utils/response';

const { badRequest } = Response;

dotenv.config();
const secret = process.env.JWTSECRET;

const verifyUser = (req, res, next) => {
  const { token } = req.headers;

  try {
    if (!token) {
      return badRequest(res, 'Authentication failed, please login', 401);
    }
    const decoded = jwt.verify(token, secret);

    if (decoded) {
      req.decoded = decoded;
      return next();
    }
  } catch (error) {
    return badRequest(res, 'Access Denied, Invalid or Expired Token');
  }
};

export default verifyUser;
