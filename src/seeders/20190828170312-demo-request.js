
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Requests', [{
    id: 1,
    source: 'lagos',
    destination: 'newyork',
    travelDate: new Date(),
    returnDate: new Date(),
    tripType: 'one-way',
    reason: 'business',
    accommodation: 'Lorem ipsum',
    status: 'pending',
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    source: 'lagos',
    destination: 'nairobi',
    travelDate: new Date(),
    returnDate: new Date(),
    tripType: 'return',
    reason: 'business',
    accommodation: 'Lorem ipsum',
    status: 'accepted',
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Requests', null, {})
};
