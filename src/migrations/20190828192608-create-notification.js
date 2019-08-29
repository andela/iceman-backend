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
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
        as: 'user_id'
      }
    },
    date: {
      type: Sequelize.DATE
    },
    createdat: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedat: {
      allowNull: false,
      type: Sequelize.DATE
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Notifications')
};
