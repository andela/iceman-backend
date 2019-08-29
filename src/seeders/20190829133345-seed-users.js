module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', [
    {
      first_name: 'user1',
      last_name: 'koroh',
      email: 'user1@gmail.com',
      password: '$2b$10$gQnYIKeqnA7OHL4FHhUt.Okk4i1lwI2SJluCv4e/CMQpzZ3KPJc.q'
    },
    {
      first_name: 'user2',
      last_name: 'koroh',
      email: 'user2@gmail.com',
      password: '$2b$10$gQnYIKeqnA7OHL4FHhUt.Okk4i1lwI2SJluCv4e/CMQpzZ3KPJc.q'
    },
    {
      first_name: 'user3',
      last_name: 'koroh',
      email: 'user3@gmail.com',
      password: '$2b$10$gQnYIKeqnA7OHL4FHhUt.Okk4i1lwI2SJluCv4e/CMQpzZ3KPJc.q'
    },
    {
      first_name: 'user4',
      last_name: 'koroh',
      email: 'user4@gmail.com',
      password: '$2b$10$gQnYIKeqnA7OHL4FHhUt.Okk4i1lwI2SJluCv4e/CMQpzZ3KPJc.q'
    },
  ], {}),
  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {})
};
