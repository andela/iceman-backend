import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const salt = bcrypt.genSaltSync(10);

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
   * @param {*} data - params data
   * @returns { string} - encypted data
   */
  static encryptor(data) {
    const encrypted = bcrypt.hashSync(data, salt);
    return encrypted;
  }
}
