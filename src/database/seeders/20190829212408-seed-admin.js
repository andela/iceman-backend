const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', [{
    firstName: 'Super',
    lastName: 'Administrator',
    email: process.env.SUPER_ADMIN_EMAIL,
    password: '$2b$10$wvm4CePaqyjuwQwvIt0qQ.WaWqyaUUQhWIr5VDitgaT2c57d86GM6',
    roleId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {})
};
