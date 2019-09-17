module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define('Feedback', {
    comment: DataTypes.STRING
  }, {});
  Feedback.associate = models => {
    Feedback.belongsTo(models.User, {
      foreignKey: 'userId'
    });
    Feedback.belongsTo(models.Accommodation, {
      foreignKey: 'accommodationId'
    });
  };
  return Feedback;
};
