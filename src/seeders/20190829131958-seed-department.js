module.exports = {
  up: async (queryInterface) => queryInterface.bulkInsert('Departments', [
    { department: 'Human Resources', manager: 1 },
    { department: 'IT', manager: 2 },
    { department: 'Marketing', manager: 3 },
  ], {}),
  down: async queryInterface => queryInterface.bulkDelete('Departments', null, {})
};
