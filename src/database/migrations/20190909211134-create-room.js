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
      type: Sequelize.STRING,
      defaultValue: 'available'
    },
    centreId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Centres',
        key: 'id',
        as: 'centreId'
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Rooms')
};
