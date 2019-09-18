module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    type: DataTypes.STRING,
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
    message: DataTypes.STRING,
    url: DataTypes.STRING,
    isRead: DataTypes.BOOLEAN
  }, { });

  return Notification;
};
