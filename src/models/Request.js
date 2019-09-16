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
    },
    passportName: {
      type: DataTypes.STRING,
    },
    passportNumber: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true
    },
    preferredLanguage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    residentialAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    preferredCurrency: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {});

  Request.associate = (models) => {
    Request.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Request.hasMany(models.Comment, {
      foreignKey: 'requestId'
    });
  };
  return Request;
};
