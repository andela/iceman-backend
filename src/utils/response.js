/**
 * Response generator
 */
export default class Response {
  /**
   * @param {object} res - response object
   * @param {object} data - response body
   * @param {integer} statusCode - status code
   * @param {string} status - status
   * @returns {object} response - success response
   */
  static success(res, data, statusCode = 200, status = 'success') {
    return res.status(statusCode).json({ status, data });
  }

  /**
   * @param {object} res - response object
   * @param {object} message - success message
   * @param {integer} statusCode - status code
   * @param {string} status - status
   * @returns {object} response - success response
   */
  static successMessage(res, message, statusCode = 200, status = 'success') {
    return res.status(statusCode).json({ status, message });
  }

  /**
   * @param {object} res - response object
   * @param {string} error - error message
   * @param {integer} statusCode - status code
   * @param {string} status - response status
   * @returns {object} response - success response
   */
  static badRequest(res, error, statusCode = 400, status = 'error') {
    return res.status(statusCode).json({ status, error });
  }

  /**
   * @param {string} errorMessage error message
   * @returns {object} errorMessage
   */
  static error(errorMessage) { throw new Error(errorMessage); }
}
