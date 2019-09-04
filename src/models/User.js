module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      middle_name: {
        type: DataTypes.STRING
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,

      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      social_id: {
        type: DataTypes.STRING,
      },
      role_id: {
        type: DataTypes.INTEGER,
      },
      reset_token: {
        type: DataTypes.STRING
      },
    },
  );
  User.associate = (models) => {
    User.hasMany(models.Request, {
      foreignKey: 'userId'
    });
    User.belongsTo(models.Role, {
      foreignKey: 'role_id'
    });
  };
  return User;
};
