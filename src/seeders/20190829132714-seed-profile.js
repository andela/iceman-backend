module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('Profiles', [
    { user_id: 5, department_id: 2 },
    { user_id: 6, department_id: 2 },
    { user_id: 7, department_id: 3 },
  ], {}),
  down: async queryInterface => queryInterface.bulkDelete('Profiles', null, {})
};
