module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {}, {});
  Like.associate = models => {
    Like.belongsTo(models.User, {
      foreignKey: 'userId'
    });
    Like.belongsTo(models.Accommodation, {
      foreignKey: 'accommodationId'
    });
  };
  return Like;
};
