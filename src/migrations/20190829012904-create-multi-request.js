module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('MultiRequests', {
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
    reason: {
      type: Sequelize.STRING
    },
    accommodation: {
      type: Sequelize.STRING
    },
    request_id: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Requests',
        key: 'id',
        as: 'request_id'
      }
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
  down: queryInterface => queryInterface.dropTable('MultiRequests')
};
