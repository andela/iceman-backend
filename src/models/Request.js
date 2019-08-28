
module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
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
    reason: {
      type: DataTypes.STRING
    },
    accommodation: {
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
