module.exports = (sequelize, DataTypes) => {
  const Centre = sequelize.define('Centre', {
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
  Centre.associate = models => {
    Centre.belongsTo(models.User, {
      foreignKey: 'userId'
    });
    Centre.hasMany(models.Room, {
      foreignKey: 'centreId'
    });
  };
  return Centre;
};
