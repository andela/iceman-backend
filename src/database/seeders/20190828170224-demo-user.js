
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', [{
    id: 1,
    firstName: 'cleave',
    lastName: 'owhiroro',
    email: 'cleave@mail.com',
    password: '$2b$10$Ei9AIY7iUCU3jN3EAH7a8ez9lBmfazkBOHCI8SPbwWkD7iT4LWkYm',
    roleId: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    firstName: 'cleave',
    lastName: 'owhiroro',
    email: 'cleave2@mail.com',
    password: '$2b$10$Ei9AIY7iUCU3jN3EAH7a8ez9lBmfazkBOHCI8SPbwWkD7iT4LWkYm',
    roleId: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    firstName: 'Super',
    lastName: 'Administrator',
    email: 'cleave3@mail.com',
    password: '$2b$10$wvm4CePaqyjuwQwvIt0qQ.WaWqyaUUQhWIr5VDitgaT2c57d86GM6',
    roleId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 4,
    firstName: 'cleave4',
    lastName: 'owhiroro4',
    email: 'cleave4@mail.com',
    password: '$2b$10$Ei9AIY7iUCU3jN3EAH7a8ez9lBmfazkBOHCI8SPbwWkD7iT4LWkYm',
    roleId: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {})
};
