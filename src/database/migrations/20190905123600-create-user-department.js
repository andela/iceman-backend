module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('UserDepartments', {
    id: {
      allowNull: false,
      autoIncrement: true,
      type: Sequelize.INTEGER
    },
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId'
      }
    },
    departmentId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
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
