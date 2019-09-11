module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Notifications', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    type: {
      type: Sequelize.STRING
    },
    senderId: {
      type: Sequelize.INTEGER,
    },
    receiverId: {
      type: Sequelize.INTEGER,
    },
    message: {
      type: Sequelize.STRING
    },
    url: {
      type: Sequelize.STRING
    },
    isRead: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
  }, { freezeTableName: true }),
  down: queryInterface => queryInterface.dropTable('Notifications')
};
