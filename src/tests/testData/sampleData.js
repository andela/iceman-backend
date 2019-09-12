export const multiRequest = {
  source: 'Nigeria',
  destination: 'Abuja, USA, POLAND',
  tripType: 'multi-city',
  travelDate: Date.now(),
  returnDate: Date.now(),
  reason: 'reason',
  accommodation: 'accommodation'
};
export const multiRequest2 = {
  source: 'Nigeria',
  destination: 'Abuja, USA, POLAND',
  tripType: 'multi-city',
  travelDate: Date.now(),
  reason: 'reason',
  accommodation: 'accommodation'
};
export const missingRequiredField = {
  tripType: 'multi-city',
  travelDate: Date.now(),
  returnDate: Date.now(),
  reason: 'reason',
  accommodation: 'accommodation'
};

export const user = {
  firstName: 'Samuel',
  lastName: 'koroh',
  email: 'user1@gmail.com',
  password: 'Ice5m5am0a843r03'
};

export const user4 = {
  id: 4,
  firstName: 'Samuel',
  lastName: 'koroh',
  email: 'user4@gmail.com',
  password: 'Ice5m5am0a843r03',
  roleId: 5
};

export const oneWayTrip = {
  source: 'Lagos',
  tripType: 'one-way',
  destination: 'Abuja',
  travelDate: Date.now(),
  returnDate: Date.now(),
  reason: 'reason',
  accommodation: 'accommodation'
};

export const testRequest = {
  source: 'Lagos',
  tripType: 'one-way',
  destination: 'Abuja',
  travelDate: Date.now(),
  returnDate: Date.now(),
  reason: 'reason',
  accommodation: 'accommodation',
  userId: 4
};

export const department = {
  department: 'devOps',
  manager: 5,
  createdAt: new Date(),
  updatedAt: new Date()
};

export const userDepartment = {
  userId: 4,
  departmentId: 10,
  createdAt: new Date(),
  updatedAt: new Date()
};

export const returnRequest = {
  source: 'Lagos',
  destination: 'Abuja',
  tripType: 'return',
  travelDate: '10/02/2019',
  returnDate: '01/01/2018',
  reason: 'Work',
  accommodation: 'Radison Blu'
};
