module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,

      },
      middleName: {
        type: DataTypes.STRING
      },
      lastName: {
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
      socialId: {
        type: DataTypes.STRING,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      resetToken: {
        type: DataTypes.STRING
      },
    },
    { },
  );
  User.associate = (models) => {
    User.hasMany(models.Request, {
      foreignKey: 'userId'
    });

    User.hasMany(models.Notification, {
      foreignKey: 'userId'
    });
    User.hasOne(models.Department, {
      foreignKey: 'manager'
    });
    User.hasOne(models.UserDepartment, {
      foreignKey: 'userId'
    });
  };
  return User;
};
