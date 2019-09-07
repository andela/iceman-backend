module.exports = (sequelize, DataTypes) => {
  const UserDepartment = sequelize.define('UserDepartment', {
  }, {});
  UserDepartment.associate = models => {
    UserDepartment.belongsTo(models.User, {
      foreignKey: 'userId'
    });
    UserDepartment.belongsTo(models.Department, {
      foreignKey: 'departmentId'
    });
  };
  return UserDepartment;
};
