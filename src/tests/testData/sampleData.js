export const multiRequest = {
  source: 'Nigeria',
  destination: 'Abuja, USA, POLAND',
  tripType: 'multi-city',
  travelDate: Date.now(),
  returnDate: Date.now(),
  reason: 'reason',
  accommodation: 'accommodation',
  gender: 'female',
  preferredLanguage: 'french',
  passportName: 'My Name',
  passportNumber: '1212323',
  preferredCurrency: 'Euro',
  residentialAddress: 'Delta state',
  rememberProfile: false
};

export const missingRequiredField = {
  tripType: 'multi-city',
  travelDate: Date.now(),
  returnDate: Date.now(),
  reason: 'reason',
  accommodation: 'accommodation',
  gender: 'female',
  preferredLanguage: 'french',
  passportName: 'My Name',
  passportNumber: '1212323',
  preferredCurrency: 'Euro',
  residentialAddress: 'Delta state',
  rememberProfile: false
};

export const user = {
  firstName: 'Samuel',
  lastName: 'koroh',
  email: 'user1@gmail.com',
  password: 'Ice5m5am0a843r03'
};

export const managerUser = {
  firstName: 'Line',
  lastName: 'Manager',
  email: 'manager1@gmail.com',
  password: 'manager1234',
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
  accommodation: 'accommodation',
  gender: 'female',
  preferredLanguage: 'french',
  passportName: 'My Name',
  passportNumber: '1212323',
  preferredCurrency: 'Euro',
  residentialAddress: 'Delta state',
  rememberProfile: true
};
export const oneWayTrip2 = {
  source: 'Lagos',
  tripType: 'one-way',
  destination: 'Abuja',
  travelDate: '10/02/2019',
  returnDate: Date(2011 - 10 - 5),
  reason: 'reason',
  accommodation: 'accommodation',
  rememberProfile: true
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
  accommodation: 'Radison Blu',
  gender: 'female',
  preferredLanguage: 'french',
  passportName: 'My Name',
  passportNumber: '1212323',
  preferredCurrency: 'Euro',
  residentialAddress: 'Delta state',
  rememberProfile: false
};


export const tripRequest = {
  source: 'Abuja',
  tripType: 'one-way',
  destination: 'Uyo',
  travelDate: '2019-11-20',
  reason: 'reason-it',
  accommodation: 'accommodation-1s',
  rememberProfile: true
};

export const user1 = {
  id: 1,
  email: 'earl@ragner.com',
  firstName: 'John',
  lastName: 'lennon',
  password: 'letmebe123',
  gender: 'female',
  preferredLanguage: 'french',
  passportName: 'My Name',
  passportNumber: '1212323',
  preferredCurrency: 'Euro',
  residentialAddress: 'Delta state',
  rememberProfile: false
};

export const user2 = {
  id: 2,
  email: 'earl@borg.com',
  firstName: 'John',
  lastName: 'lennon',
  password: 'letmebe123',
  gender: 'female',
  preferredLanguage: 'french',
  passportName: 'My Name',
  passportNumber: '1212323',
  preferredCurrency: 'Euro',
  residentialAddress: 'Delta state',
  rememberProfile: false
};

export const user3 = {
  id: 3,
  email: 'earl@ingstad.com',
  firstName: 'John',
  lastName: 'lennon',
  password: 'letmebe123',
  gender: 'female',
  preferredLanguage: 'french',
  passportName: 'My Name',
  passportNumber: '1212323',
  preferredCurrency: 'Euro',
  residentialAddress: 'Delta state',
  rememberProfile: false
};

export const userDepartments = [
  {
    userId: 1,
    departmentId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 2,
    departmentId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const departments = [
  {
    id: 1,
    department: 'devOps',
    manager: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    department: 'devOps',
    manager: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const commentBody = {
  comment: 'this is a comment'
};
