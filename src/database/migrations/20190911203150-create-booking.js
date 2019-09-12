module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Bookings', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId'
      }
    },
    accommodationId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    requestId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    roomId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    roomType: {
      type: Sequelize.STRING,
      allowNull: false
    },
    numberOfRooms: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    checkIn: {
      type: Sequelize.DATE,
      allowNull: false
    },
    checkOut: {
      type: Sequelize.DATE,
      allowNull: false
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Bookings')
};
