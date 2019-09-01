module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
<<<<<<< HEAD
    source: {
=======
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
<<<<<<< HEAD
<<<<<<< HEAD
    source: {
=======
    origin: {
>>>>>>> feature(return-trip):add user return trip
=======
    source: {
>>>>>>> implementation of feedback
>>>>>>> implementation of feedback
      type: DataTypes.STRING,
      allowNull: false
    },
    destination: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    tripType: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['one-way', 'return', 'multi-city'],
    },
    travelDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    returnDate: {
      type: DataTypes.DATE
    },
    reason: {
      type: DataTypes.STRING
    },
    accommodation: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'open',
    }
  }, {});
  Request.associate = (models) => {
    Request.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Request;
};
