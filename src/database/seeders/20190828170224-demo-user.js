
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', [{
    firstName: 'cleave',
    lastName: 'owhiroro',
    email: 'cleave@mail.com',
    password: '$2b$10$Ei9AIY7iUCU3jN3EAH7a8ez9lBmfazkBOHCI8SPbwWkD7iT4LWkYm',
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
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    first_name: 'cleave',
    last_name: 'owhiroro',
    email: 'cleave2@mail.com',
    password: '$2b$10$Ei9AIY7iUCU3jN3EAH7a8ez9lBmfazkBOHCI8SPbwWkD7iT4LWkYm',
    line_manager: 14,
    is_verified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {})
};
