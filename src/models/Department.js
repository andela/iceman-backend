module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    department: DataTypes.STRING,
    manager: DataTypes.STRING
  }, {});
  Department.associate = (models) => {
  };
  return Department;
};
