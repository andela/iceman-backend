module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Rooms', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    roomType: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['single', 'double', 'triple', 'quad',
        'queen', 'king', 'twin', 'double-double', 'studio'],
    },
    facilities: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    images: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false
    },
    price: {
      type: Sequelize.NUMERIC
    },
    description: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['available', 'booked'],
      defaultValue: 'available'
    },
    accommodationId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Accommodation',
        key: 'id',
        as: 'accommodationId'
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
  }),
  down: queryInterface => queryInterface.dropTable('Rooms')
};
