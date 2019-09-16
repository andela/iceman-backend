import DepartmentService from '../services/departmentService';
import response from '../utils/response';

const { success, badRequest, successMessage } = response;
const { getAllDepartments, assignManager } = DepartmentService;

/**
 * Department controller
 */
export default class DepartmentController {
  /**
     *
     * @param {object} req - request object
     * @param {object} res - response object
     * @return {object} - json
     */
  static async getDepartments(req, res) {
    try {
      const data = await getAllDepartments();

      success(res, data);
    } catch ({ message: error }) {
      badRequest(res, error);
    }
  }

  /**
 * Update a pending trip request
 * @param {object} req - request object
 * @param {object} res - response object
 * @return {json} - json
 */
  static async assignManager(req, res) {
    try {
      const result = await assignManager(req);

      successMessage(res, result);
    } catch ({ message: err }) {
      badRequest(res, err);
    }
  }
}
