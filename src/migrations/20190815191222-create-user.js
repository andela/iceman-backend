module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false,

    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,

    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    is_verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    is_admin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    role: {
      type: Sequelize.STRING,
      defaultValue: 'requester'
    },
    gender: {
      type: Sequelize.STRING,
      allowNull: true
    },
    date_of_birth: {
      type: Sequelize.DATE,
      allowNull: true
    },
    preferred_language: {
      type: Sequelize.STRING,
      allowNull: true
    },
    residential_address: {
      type: Sequelize.STRING,
      allowNull: true
    },
    preferred_currency: {
      type: Sequelize.STRING,
      allowNull: true
    },
    reset_token: {
      type: Sequelize.STRING
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
  }),
  down: (queryInterface) => queryInterface.dropTable('Users')
};
