
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Requests', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    source: {
      type: Sequelize.STRING,
      allowNull: false
    },
    destination: {
      type: Sequelize.STRING,
      allowNull: false
    },
    travel_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    return_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    type: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['one-way', 'return', 'multi-city'],
    },
    reason: {
      type: Sequelize.STRING
    },
    accommodation: {
      type: Sequelize.STRING
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
    status: {
      type: Sequelize.STRING,
      defaultValue: 'pending',
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
  down: queryInterface => queryInterface.dropTable('Requests')
};
