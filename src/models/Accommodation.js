module.exports = (sequelize, DataTypes) => {
  const Accommodation = sequelize.define('Accommodation', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    roomsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  }, {});
  Accommodation.associate = models => {
    Accommodation.belongsTo(models.User, {
      foreignKey: 'userId'
    });
    Accommodation.hasMany(models.Room, {
      foreignKey: 'accommodationId'
    });
  };
  return Accommodation;
};
