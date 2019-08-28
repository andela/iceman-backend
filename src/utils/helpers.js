import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
/**
 * Helper class
 */
export default class Helper {
  /**
   * Method to exclude properties from an object
   * @param {object} objectItem - The object to exclude fields from
   * @param {array} fields - Array of fields to be removed
   * @returns {object} - new object
   */
  static omitFields(objectItem, fields) {
    const items = objectItem;

    fields.forEach((field) => {
      delete items[field];
    });

    return items;
  }

  /**
   * Method to exclude properties from an object
   * @param {object} objectItem - The object to extract fields from
   * @param {array} fields - Array of fields to be extracted
   * @returns {object} - new object
   */
  static pickFields(objectItem, fields) {
    const items = {};

    fields.forEach((field) => {
      items[field] = objectItem[field];
    });

    return items;
  }

  /**
   * Method encrypt data
   * @param {string} password - password to encrypt
   * @param { number } rounds - salt value
   * @returns { string} - encypted data
   */
  static async encryptor(password, rounds = 10) {
    const salt = await bcrypt.genSaltSync(rounds);
    const encrypted = await bcrypt.hashSync(password, salt);

    return encrypted;
  }

  /**
   * Method generate token
   * @param {object} payloader - data
   * @returns {string} - token
   */
  static genToken(payloader) {
    const secret = process.env.JWTSECRET;
    const token = jwt.sign(payloader, secret, { expiresIn: '1hr' });

    return token;
  }

  /**
   * Method generate token
   * @param {object} profile -user social profile
   * @returns {object} - user details
   */
  static getUserSocialDetails(profile) {
    const { provider, _json: data } = profile;
    const user = { password: crypto.randomBytes(15).toString('hex') };
    if (provider === 'google') {
      user.email = data.email;
      user.image = data.picture;
      user.social_id = data.sub;
      user.first_name = data.given_name;
      user.last_name = data.family_name;
    } else {
      user.social_id = data.id;
      user.email = data.email;
      user.first_name = data.first_name;
      user.last_name = data.last_name;
      user.middle_name = data.middle_name;
      user.image = data.picture.data.url;
    }
    return user;
  }
}
