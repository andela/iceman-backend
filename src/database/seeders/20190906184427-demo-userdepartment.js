module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('UserDepartments', [{
    userId: 1,
    departmentId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('UserDepartments', null, {})
};
