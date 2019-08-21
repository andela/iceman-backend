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
      unique: false
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false
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
<<<<<<< HEAD:src/migrations/20190815191222-create-user.js
      allowNull: false
    },
    is_verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    is_admin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
=======
      allowNull: false,
      unique: false
    },
    is_admin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    is_verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
>>>>>>> feature(authorization):add user registeration:src/migrations/create-user.js
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
