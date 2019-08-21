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
}
