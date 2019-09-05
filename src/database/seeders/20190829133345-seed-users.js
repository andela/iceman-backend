module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', [
    {
      firstName: 'user1',
      lastName: 'koroh',
      email: 'user1@gmail.com',
      password: '$2b$10$gQnYIKeqnA7OHL4FHhUt.Okk4i1lwI2SJluCv4e/CMQpzZ3KPJc.q'
    },
    {
      firstName: 'user2',
      lastName: 'koroh',
      email: 'user2@gmail.com',
      password: '$2b$10$gQnYIKeqnA7OHL4FHhUt.Okk4i1lwI2SJluCv4e/CMQpzZ3KPJc.q'
    },
    {
      firstName: 'user3',
      lastName: 'koroh',
      email: 'user3@gmail.com',
      password: '$2b$10$gQnYIKeqnA7OHL4FHhUt.Okk4i1lwI2SJluCv4e/CMQpzZ3KPJc.q'
    },
    {
      firstName: 'user4',
      lastName: 'koroh',
      email: 'user4@gmail.com',
      password: '$2b$10$gQnYIKeqnA7OHL4FHhUt.Okk4i1lwI2SJluCv4e/CMQpzZ3KPJc.q'
    },
  ], {}),
  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
