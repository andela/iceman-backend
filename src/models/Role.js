module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {});
  Role.associate = models => {
    Role.hasMany(models.User, {
      foreignKey: 'roleId',
      define: {
        undersored: true
      }
    });
  };
  return Role;
};
