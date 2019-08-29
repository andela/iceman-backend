import jwt from 'jsonwebtoken';

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
}
