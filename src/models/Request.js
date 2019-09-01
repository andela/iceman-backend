
module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    source: {
      type: DataTypes.STRING,
      allowNull: false
    },
    destination: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['one-way', 'return', 'multi-city'],
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
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    }
  }, {});
  Request.associate = (models) => {
    Request.belongsTo(models.User, {
      references: {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      }
    });
  };
  return Request;
};
