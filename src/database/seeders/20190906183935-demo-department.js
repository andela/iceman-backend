module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Departments', [{
    department: 'devOps',
    manager: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    department: 'Human resource',
    manager: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {})
};
