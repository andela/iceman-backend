import jwt from 'jsonwebtoken';

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
  if (!token) return res.status(401).json({ status: 'error', error: 'Access Denied, No token provided' });
  try {
    const payload = await jwt.verify(token, jwtSecret);
    req.user = payload;
    next();
  } catch (error) {
    res.status(400).json({ status: 'error', error: 'Access Denied, Invalid token' });
  }
};
