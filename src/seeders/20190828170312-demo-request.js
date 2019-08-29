
const demoRequest = (id, status) => ({
  id,
  source: 'lagos',
  destination: 'newyork',
  travelDate: new Date(),
  returnDate: new Date(),
  tripType: 'one-way',
  reason: 'business',
  accommodation: 'Lorem ipsum',
  status,
  userId: 1,
  createdAt: new Date(),
  updatedAt: new Date()
});
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Requests', [
    demoRequest(1, 'pending'),
    demoRequest(2, 'accepted')
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Requests', null, {})
};
