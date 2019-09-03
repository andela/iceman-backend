module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {});
  Role.associate = models => {
    Role.hasMany(models.User, {
      foreignKey: 'roleId'
    });
  };
  return Role;
};
