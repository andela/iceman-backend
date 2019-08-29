module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', [{
    id: 1,
    first_name: 'cleave',
    last_name: 'owhiroro',
    email: 'cleave@mail.com',
    password: '$2b$10$Ei9AIY7iUCU3jN3EAH7a8ez9lBmfazkBOHCI8SPbwWkD7iT4LWkYm',
    is_verified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {})
};
