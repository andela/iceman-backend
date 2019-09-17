module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    roomType: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['single', 'double', 'triple', 'quad',
        'queen', 'king', 'twin', 'double-double', 'studio'],
    },
    facilities: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    price: {
      type: DataTypes.NUMERIC
    },
    description: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'available'
    }
  }, {});
  Room.associate = models => {
    Room.belongsTo(models.Accommodation, {
      foreignKey: 'accommodationId',
      onDelete: 'CASCADE'
    });
  };
  return Room;
};
