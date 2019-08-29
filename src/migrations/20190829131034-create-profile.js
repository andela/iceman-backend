module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Profiles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    user_id: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'user_id'
      }
    },
    department_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Departments',
        key: 'id',
        as: 'department_id'
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
  down: (queryInterface) => queryInterface.dropTable('Profiles')
};
