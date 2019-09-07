
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', [{
    firstName: 'cleave',
    lastName: 'owhiroro',
    email: 'cleave@mail.com',
    password: '$2b$10$Ei9AIY7iUCU3jN3EAH7a8ez9lBmfazkBOHCI8SPbwWkD7iT4LWkYm',
<<<<<<< HEAD
<<<<<<< HEAD
    roleId: 5,
=======
<<<<<<< HEAD:src/database/seeders/20190828170224-demo-user.js
    isVerified: true,
=======
    line_manager: 12,
    is_verified: true,
>>>>>>> implement availing request logic:src/seeders/20190828170224-demo-user.js
>>>>>>> implement availing request logic
=======
    isAdmin: true,
    isVerified: true,
>>>>>>> update migrations and seeders
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    firstName: 'cleave',
    lastName: 'owhiroro',
    email: 'cleave2@mail.com',
    password: '$2b$10$Ei9AIY7iUCU3jN3EAH7a8ez9lBmfazkBOHCI8SPbwWkD7iT4LWkYm',
    isAdmin: true,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {})
};
