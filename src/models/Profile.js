module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    user_id: DataTypes.INTEGER,
    department_id: DataTypes.INTEGER
  }, { });
  Profile.associate = (models) => {
    Profile.belongsTo(models.User, {
      references: {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      }
    });
    Profile.belongsTo(models.Department, {
      references: {
        foreignKey: 'department_id'
      }
    });
  };
  return Profile;
};
