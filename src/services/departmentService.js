import { User, Department } from '../models';
import Response from '../utils/response';

const { error } = Response;

/**
 * Department services
 */
export default class DepartmentService {
  /**
 * @returns {object} - response with all accommodation
 */
  static async getAllDepartments() {
    const departments = await Department.findAll({
      attributes: ['department', 'manager']
    });

    return departments.length > 0 ? departments : error('There are currently no departments');
  }

  /**
 *
 * @param {object} param0 - request body
 * @return {object} - updated department
 */
  static async assignManager({ body }) {
    const { userId, department } = body;
    const departments = await Department.findOne({ where: { department } });

    if (!departments) error('Department not found');

    const user = await User.findOne({ where: { id: userId }, attributes: ['roleId', 'firstName', 'lastName'] });

    if (!user) error('User not found');

    const { roleId, firstName, lastName } = user;

    if (roleId !== 4) await User.update({ roleId: 4 }, { where: { id: userId } });

    await Department.update({ manager: userId }, { where: { department } });

    return `${firstName} ${lastName} is now the manager of ${department} department`;
  }
}
