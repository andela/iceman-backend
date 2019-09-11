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
      roleId: {
        type: DataTypes.INTEGER,
      },
      lineManager: {
        type: DataTypes.INTEGER
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true
      },
      preferredLanguage: {
        type: DataTypes.STRING,
        allowNull: true
      },
      residentialAddress: {
        type: DataTypes.STRING,
        allowNull: true
      },
      preferredCurrency: {
        type: DataTypes.STRING,
        allowNull: true
      },
      resetToken: {
        type: DataTypes.STRING
      },
      rememberProfile: {
        type: DataTypes.BOOLEAN
      },
      passportName: {
        type: DataTypes.STRING
      },
      emailNotify: {
        type: DataTypes.BOOLEAN
      }
    },
    { },
  );
  User.associate = (models) => {
    User.hasMany(models.Request, {
      foreignKey: 'userId'
    });
    User.belongsTo(models.Role, {
      foreignKey: 'roleId'
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
