module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('UserDepartments', {
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId'
      }
    },
    departmentId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Departments',
        key: 'id',
        as: 'departmentId'
      }
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }, { freezeTableName: true }),
  down: queryInterface => queryInterface.dropTable('UserDepartments')
};
