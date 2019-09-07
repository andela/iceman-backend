module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Departments', [{
    department: 'dev',
    manager: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {})
};
