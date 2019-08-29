module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Departments', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    department: {
      type: Sequelize.STRING
    },
    manager: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
        as: 'manager'
      }
    },
    createdat: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedat: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface) => queryInterface.dropTable('Departments')
};
