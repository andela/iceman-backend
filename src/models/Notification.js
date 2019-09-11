module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    type: DataTypes.STRING,
    date: DataTypes.DATE,
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
    message: DataTypes.STRING,
    url: DataTypes.STRING,
    isRead: DataTypes.BOOLEAN
  }, { });

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, {
      references: {
        foreignKey: 'receiverId',
        onDelete: 'CASCADE'
      }
    });
  };
  return Notification;
};
