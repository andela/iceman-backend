module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    department: DataTypes.STRING,
    manager: DataTypes.INTEGER,
  }, {});
  Department.associate = models => {
    Department.hasOne(models.UserDepartment, {
      foreignKey: 'departmentId'
    });
  };
  return Department;
};
