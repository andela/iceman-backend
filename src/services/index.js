/**
 * Class to VerifyErrors
 */
export default class VerifyErrors extends Error {
  /**
     * VerifyError constructor
     * @param {number} status - Error Status
     * @param {String} message - Error Message
     */
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }
}
