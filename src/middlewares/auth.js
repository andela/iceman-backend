import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.JWTSECRET;

const verifyUser = (req, res, next) => {
  const { token } = req.headers;
  try {
    if (!token) {
      return res.status(403).json({
        status: 403,
        error: 'Authentication failed, please login',
      });
    }
    const decoded = jwt.verify(token, secret);
    if (decoded) {
      req.decoded = decoded;
      return next();
    }
  } catch (error) {
    return res.status(401).json({
      status: 401,
      error: 'Access Denied',
    });
  }
};

export default verifyUser;
