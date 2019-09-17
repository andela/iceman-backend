module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Departments', [{
    id: 1,
    department: 'devOps',
    manager: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    department: 'Human resource',
    manager: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Departments', null, {})
};
