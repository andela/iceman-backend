import jwt from 'jsonwebtoken';
/**
 * @description Generate token
 * @param {*} payloader
 */
const secret = process.env.JWTSECRET;

export default (payloader) => jwt.sign(payloader, secret, { expiresIn: '1hr' });
