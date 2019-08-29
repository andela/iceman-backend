module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    department: DataTypes.STRING,
    manager: DataTypes.INTEGER
  }, {});
  Department.associate = (models) => {
    Department.belongsTo(models.User, {
      references: {
        foreignKey: 'manager'
      }
    });
  };
  return Department;
};
