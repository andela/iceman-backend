module.exports = (sequelize, DataTypes) => {
  const MultiRequest = sequelize.define('MultiRequest', {
    source: {
      type: DataTypes.STRING,
      allowNull: false
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false
    },
    travel_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    return_date: {
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
  MultiRequest.associate = (models) => {
    MultiRequest.belongsTo(models.Request, {
      references: {
        foreignKey: 'request_id',
        onDelete: 'CASCADE'
      }
    });
  };
  return MultiRequest;
};
