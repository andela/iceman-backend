module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('UserDepartments', [{
    userId: 1,
    departmentId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 2,
    departmentId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 3,
    departmentId: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 4,
    departmentId: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('UserDepartments', null, {})
};
