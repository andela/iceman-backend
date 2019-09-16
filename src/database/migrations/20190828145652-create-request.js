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
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false
    },
    travelDate: {
      type: Sequelize.DATE,
      allowNull: false
    },
    returnDate: {
      type: Sequelize.DATE
    },
    tripType: {
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
    userId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId'
      }
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: 'open',
    },
    passportName: {
      type: Sequelize.STRING
    },
    passportNumber: {
      type: Sequelize.STRING
    },
    gender: {
      type: Sequelize.STRING,
      allowNull: true
    },
    preferredLanguage: {
      type: Sequelize.STRING,
      allowNull: true
    },
    residentialAddress: {
      type: Sequelize.STRING,
      allowNull: true
    },
    preferredCurrency: {
      type: Sequelize.STRING,
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
  }, { freezeTableName: true }),

  down: queryInterface => queryInterface.dropTable('Requests')
};
