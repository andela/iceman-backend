module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Comments', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    comment: {
      type: Sequelize.STRING
    },
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.fn('now')
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId'
      },
      allowNull: false
    },
    requestId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Requests',
        key: 'id',
        as: 'requestId'
      },
      allowNull: false
    },
    deleted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, { timestamps: false }),
  down: (queryInterface) => queryInterface.dropTable('Comments')
};
