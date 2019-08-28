
module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false
    },
    travelDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    returnDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tripType: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['one-way', 'return'],
    },
    reason: {
      type: DataTypes.STRING
    },
    accommodation: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING
    },
  }, {});
  Request.associate = (models) => {
    Request.belongsTo(models.User, {
      references: {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      }
    });
  };
  return Request;
};
