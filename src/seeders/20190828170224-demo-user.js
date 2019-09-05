
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', [{
    id: 1,
    firstName: 'cleave',
    lastName: 'owhiroro',
    email: 'cleave@mail.com',
    password: '$2b$10$Ei9AIY7iUCU3jN3EAH7a8ez9lBmfazkBOHCI8SPbwWkD7iT4LWkYm',
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {})
};
