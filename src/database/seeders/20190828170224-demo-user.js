
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
    firstName: 'demo',
    lastName: 'user',
    email: 'demo@mail.com',
    password: '$2b$10$Ei9AIY7iUCU3jN3EAH7a8ez9lBmfazkBOHCI8SPbwWkD7iT4LWkYm',
    roleId: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    firstName: 'Super',
    lastName: 'Administrator',
    email: 'super@mail.com',
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
  {
    id: 5,
    firstName: 'Super',
    lastName: 'Administrator',
    email: 'inspiron.amos@gmail.com',
    password: '$2b$10$wvm4CePaqyjuwQwvIt0qQ.WaWqyaUUQhWIr5VDitgaT2c57d86GM6',
    roleId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 6,
    firstName: 'Su',
    lastName: 'Admin',
    email: 'amos@gmail.com',
    password: '$2b$10$wvm4CePaqyjuwQwvIt0qQ.WaWqyaUUQhWIr5VDitgaT2c57d86GM6',
    roleId: 1,
    createdAt: new Date(),
    updatedAt: new Date()

  }
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {})
};
