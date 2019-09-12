module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    roomType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    numberOfRooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    checkIn: {
      type: DataTypes.DATE,
      allowNull: false
    },
    checkOut: {
      type: DataTypes.DATE,
      allowNull: false
    },

  }, {});
  Booking.associate = (models) => {
    Booking.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Booking.belongsTo(models.Request, {
      foreignKey: 'requestId',
      onDelete: 'CASCADE'
    });
  };
  return Booking;
};
