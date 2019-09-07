module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    department: DataTypes.STRING
  }, {});
  Department.associate = models => {
    Department.belongsTo(models.User, {
      foreignKey: 'manager'
    });
    Department.hasOne(models.UserDepartment, {
      foreignKey: 'departmentId'
    });
  };
  return Department;
};
