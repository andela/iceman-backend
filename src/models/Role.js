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
  // eslint-disable-next-line arrow-parens
  Role.associate = models => {
    Role.hasMany(models.User, {
      foreignKey: 'roleId'
    });
  };
  return Role;
};
