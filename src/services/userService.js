import { User, Role } from '../models';

/**
 * Class for user services
 */
export default class AdminService {
  /**
   * @param {*} req - object
   * @return {string} - success message;
   */
  static async assignUser(req) {
    const { email } = req.body;
    const roleId = Number(req.params.roleId);
    const checkRole = await Role.findOne({ where: { id: roleId } });
    const result = await User.findOne({ where: { email }, include: [{ model: Role, attributes: ['type'] }] });

    if (!result) throw new Error('User not found');

    if (!checkRole) throw new Error('Role does not exit, Must be between 1-6');

    if (result.dataValues.Role.dataValues.type === 'guest') throw new Error('User email is not verified');

    if (result.dataValues.roleId === roleId) throw new Error('User is already assigned this role');

    await User.update({ roleId }, { where: { email } });

    return 'User Role Assigned Successfully';
  }
}
