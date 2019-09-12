module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', [{
    id: 1,
    firstName: 'Elijah',
    lastName: 'Udogu',
    email: 'elijah.udogu@admin.com',
    password: '$2b$10$MTLI97lXTbqPqLJ0rKvuKOhpb7O/0M9J9fHb4RVGnS8s49etPRyPW',
    roleId: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    firstName: 'Elijah',
    lastName: 'Udogu',
    email: 'elijah.udogu2@admin.com',
    password: '$2b$10$MTLI97lXTbqPqLJ0rKvuKOhpb7O/0M9J9fHb4RVGnS8s49etPRyPW',
    roleId: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    firstName: 'Super',
    lastName: 'Admin',
    email: 'super.admin@admin.com',
    password: '$2b$10$wvm4CePaqyjuwQwvIt0qQ.WaWqyaUUQhWIr5VDitgaT2c57d86GM6',
    roleId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 4,
    firstName: 'Elijah',
    lastName: 'Udogu',
    email: 'elijah.udogu4@admin.com',
    password: '$2b$10$MTLI97lXTbqPqLJ0rKvuKOhpb7O/0M9J9fHb4RVGnS8s49etPRyPW',
    roleId: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 5,
    firstName: 'Elijah',
    lastName: 'Udogu',
    email: 'elijah.udogu5@admin.com',
    password: '$2b$10$MTLI97lXTbqPqLJ0rKvuKOhpb7O/0M9J9fHb4RVGnS8s49etPRyPW',
    roleId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {})
};
