module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
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
    middle_name: {
      type: Sequelize.STRING
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
    social_id: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    role_id: {
      type: Sequelize.INTEGER,
      defaultValue: 6,
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
