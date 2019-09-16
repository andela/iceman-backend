module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    middleName: {
      type: Sequelize.STRING
    },
    lastName: {
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
    socialId: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    roleId: {
      type: Sequelize.INTEGER,
      defaultValue: 6,
    },
    gender: {
      type: Sequelize.STRING,
      allowNull: true
    },
    dateOfBirth: {
      type: Sequelize.DATE,
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
    resetToken: {
      type: Sequelize.STRING
    },
    rememberProfile: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    passportName: {
      type: Sequelize.STRING
    },
    passportNumber: {
      type: Sequelize.STRING
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
  down: queryInterface => queryInterface.dropTable('Users')
};
