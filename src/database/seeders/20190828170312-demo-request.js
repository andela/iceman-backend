
const demoRequest = (id, status, userId) => ({
  id,
  source: 'lagos',
  destination: ['newyork'],
  travelDate: new Date(),
  returnDate: new Date(),
  tripType: 'one-way',
  reason: 'business',
  accommodation: 'Lorem ipsum',
  status,
  userId,
  createdAt: new Date(),
  updatedAt: new Date()
});
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Requests', [
    demoRequest(11, 'open', 2),
    demoRequest(22, 'accepted', 2),
    demoRequest(33, 'open', 1),
    demoRequest(44, 'rejected', 1)
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Requests', null, {})
};
