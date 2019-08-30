module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,

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
        allowNull: false,
      },
      is_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      reset_token: {
        type: DataTypes.STRING
      },
    },
    { },
  );
  User.associate = (models) => {
    User.hasMany(models.Request, {
      foreignKey: 'userId'
    });
  };
  return User;
};
