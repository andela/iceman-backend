import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import TestHelper from '../utils/testHelper';
import Helper from '../utils/helpers';
import db from '../models';
import insertRoles from '../utils/insertTestRoles';
import {
  multiRequest,
  multiRequest2,
  missingRequiredField,
  oneWayTrip,
  user,
  returnRequest,
  tripRequest,
  managerUser,
  noProfileRequest
} from './testData/sampleData';

chai.use(chaiHttp);
chai.should();

const URL_PREFIX = '/api/v1/requests';
const USER_PREFIX = '/api/v1/auth';
let loginUser;
let loginUser2;
let loginUser3;
let loginManager;
let department;
let request;
let managerRequest;
let manager;
let manager2;

const profileDetails = {
  gender: 'Male',
  dateOfBirth: '1994-05-20',
  preferredLanguage: 'English',
  residentialAddress: 'Benin City, Nigeria',
  preferredCurrency: 'Nigerian Naira (NGN)',
  passportName: 'Test Tester',
  passportNumber: '3434322112'
};

describe('/api/v1/requests', () => {
  before(async () => {
    await TestHelper.destroyModel('User');
    await TestHelper.destroyModel('Role');
    await TestHelper.destroyModel('Request');
    await TestHelper.destroyModel('Department');
    await TestHelper.destroyModel('UserDepartment');
    await db.Role.bulkCreate(insertRoles);

    await TestHelper.createUser({
      ...user, roleId: 5
    });

    await TestHelper.createUser({
      ...user, email: 'user2@gmail.com', roleId: 5
    });

    await TestHelper.createUser({
      ...user, email: 'user3@gmail.com', roleId: 5
    });

    await TestHelper.createUser({
      ...user, email: 'manager@gmail.com', roleId: 4
    });

    await TestHelper.createUser({
      ...user, email: 'manager2@gmail.com', roleId: 4
    });

    await TestHelper.createUser({
      ...managerUser, roleId: 4,
    });

    loginUser = await chai.request(app)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send(Helper.pickFields(user, ['email', 'password']));

    loginUser2 = await chai.request(app)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send({ email: 'user2@gmail.com', password: user.password });

    loginUser3 = await chai.request(app)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send({ email: 'user3@gmail.com', password: user.password });

    loginManager = await chai.request(app)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send(Helper.pickFields(managerUser, ['email', 'password']));

    request = await chai.request(app)
      .post(`${URL_PREFIX}/multi-city`)
      .set('Content-Type', 'application/json')
      .set('token', loginUser.body.data.token)
      .send(multiRequest);

    managerRequest = await chai.request(app)
      .post(`${URL_PREFIX}/multi-city`)
      .set('Content-Type', 'application/json')
      .set('token', loginManager.body.data.token)
      .send(multiRequest);

    manager = await chai.request(app)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send({ email: 'manager@gmail.com', password: user.password });

    manager2 = await chai.request(app)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send({ email: 'manager2@gmail.com', password: user.password });

    department = await TestHelper.createDepartment({ department: 'dev', manager: manager.body.data.id });

    await TestHelper.createUserDepartment({
      userId: loginUser2.body.data.id,
      departmentId: department.id
    });
    await TestHelper.createUserDepartment({
      userId: loginManager.body.data.id,
      departmentId: department.id
    });
  });

  describe('POST /multi-city', () => {
    it('should return 200 if the request finished successfully', async () => {
      request.should.have.status(200);
      request.body.data.should.have.property('destination');
      request.body.data.should.have.property('source');
      request.body.data.should.have.property('tripType', 'multi-city');
      request.body.data.should.have.property('returnDate');
      request.body.data.should.have.property('travelDate');
      request.body.data.should.have.property('userId');
    });

    it('should return 400 if the trip is already booked', async () => {
      const { text, status } = await chai.request(app)
        .post(`${URL_PREFIX}/multi-city`)
        .set('token', loginUser.body.data.token)
        .send(multiRequest);

      expect(status).to.equal(400);
      expect(JSON.parse(text).error).to.equal('You are not allowed to make multiple request');
    });

    it('should return 400 if the request is less than 2', async () => {
      const { text, status } = await chai.request(app)
        .post(`${URL_PREFIX}/multi-city`)
        .set('token', loginUser.body.data.token)
        .send(oneWayTrip);

      expect(status).to.equal(400);
      expect(JSON.parse(text).error).to.equal('Request destination must be more than one');
    });

    it('should return 400 if pass empty requests', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/multi-city`)
        .set('Content-Type', 'application/json')
        .set('token', loginUser.body.data.token)
        .send({});

      res.should.have.status(400);
    });

    it('should return 400 if return date is not provided', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/multi-city`)
        .set('Content-Type', 'application/json')
        .set('token', loginUser3.body.data.token)
        .send({ ...multiRequest2 });

      res.should.have.status(400);
      res.body.should.have.property('error', 'Return date is required');
    });

    it('should return 400 if required fields where not passed', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/multi-city`)
        .set('Content-Type', 'application/json')
        .set('token', loginUser.body.data.token)
        .send(missingRequiredField);

      res.should.have.status(400);
    });

    it('should return 400 if passed invalid token', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/multi-city`)
        .set('Content-Type', 'application/json')
        .set('token', 'loginUser.body.data.token')
        .send(missingRequiredField);

      res.should.have.status(400);
    });

    it('should return 401 if passed empty token', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/multi-city`)
        .set('Content-Type', 'application/json')
        .set('token', '')
        .send(missingRequiredField);

      res.should.have.status(401);
    });
  });

  describe('POST / Oneway Trip', () => {
    it('should return 400 error if source is not provided', async () => {
      const { status } = await chai.request(app)
        .post(`${URL_PREFIX}/one-way`)
        .set('token', loginUser2.body.data.token)
        .send({ ...oneWayTrip, source: null });

      expect(status).to.equal(400);
    });

    it('should not use user details to make a request if rememberProfile is false', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/one-way`)
        .set('token', loginUser2.body.data.token)
        .send(noProfileRequest);

      res.should.have.status(400);
      res.body.error[0].should.equal('passportName is Required');
      res.body.error[1].should.equal('passportNumber is Required');
      res.body.error[2].should.equal('gender is Required');
      res.body.error[3].should.equal('preferredLanguage is Required');
      res.body.error[5].should.equal('preferredCurrency is Required');
      res.body.error[4].should.equal('residentialAddress is Required');
    });

    it('should return 201 if one way trip was created', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/one-way`)
        .set('token', loginUser2.body.data.token)
        .send(oneWayTrip);

      expect(res.status).to.equal(201);
      expect(JSON.parse(res.text).data.source).to.equal('Lagos');
    });

    it('should update user profile', async () => {
      const res = await chai.request(app)
        .patch(`${USER_PREFIX}/profile`)
        .set('token', loginUser2.body.data.token)
        .send(profileDetails);

      res.should.have.status(200);
      res.body.should.have.property('status').eql('success');
      res.body.should.have.property('data');
      res.body.data.should.be.a('object');
      res.body.data.should.have.property('firstName').eql('Samuel');
      res.body.data.should.have.property('lastName').eql('koroh');
      res.body.data.should.have.property('email').eql('user2@gmail.com');
      res.body.data.should.have.property('roleId');
      res.body.data.should.have.property('gender').eql('Male');
      res.body.data.should.have.property('dateOfBirth');
      res.body.data.should.have.property('preferredLanguage').eql('English');
      res.body.data.should.have.property('preferredCurrency').eql('Nigerian Naira (NGN)');
      res.body.data.should.have.property('residentialAddress').eql('Benin City, Nigeria');
    });

    it('should use user details to make a request if rememberProfile is true', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/one-way`)
        .set('token', loginUser2.body.data.token)
        .send(tripRequest);

      res.should.have.status(201);
      res.body.data.should.have.property('destination');
      res.body.data.should.have.property('source');
      res.body.data.should.have.property('tripType', 'one-way');
      res.body.data.should.have.property('returnDate');
      res.body.data.should.have.property('travelDate');
      res.body.data.should.have.property('userId');
      res.body.data.should.have.property('gender');
      res.body.data.should.have.property('preferredLanguage');
      res.body.data.should.have.property('preferredCurrency');
      res.body.data.should.have.property('residentialAddress');
    });


    it('should return 409 if the trip is already booked', async () => {
      const { text, status } = await chai.request(app)
        .post(`${URL_PREFIX}/one-way`)
        .set('token', loginUser2.body.data.token)
        .send(oneWayTrip);

      expect(status).to.equal(409);
      expect(JSON.parse(text).error).to.equal('You are not allowed to make multiple request');
    });
  });

  describe('PATCH /', () => {
    it('should update an open trip request when user is logged in and required details are provided', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/${request.body.data.id}`)
        .set('token', loginUser.body.data.token)
        .send(multiRequest);

      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.have.property('status').eql('success');
      res.body.data.should.have.property('source');
      res.body.data.should.have.property('reason');
      res.body.data.should.have.property('accommodation');
    });

    it('should update an open trip request when user is logged in and required details are provided', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/${request.body.data.id}`)
        .set('token', loginUser.body.data.token)
        .send(oneWayTrip);

      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.have.property('status').eql('success');
      res.body.data.should.have.property('source');
      res.body.data.should.have.property('reason');
      res.body.data.should.have.property('accommodation');
    });

    it('should throw not found error when request does not exist', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/144`)
        .set('token', loginUser.body.data.token)
        .send(oneWayTrip);

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('Trip request not found');
    });

    it('should not be able to update the request of another user', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/${request.body.data.id}`)
        .set('token', loginUser2.body.data.token)
        .send(multiRequest);

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('You are not allowed to edit this request');
    });

    it('should not update a trip that has been accepted or reject', async () => {
      await chai.request(app)
        .patch(`${URL_PREFIX}/${request.body.data.id}`)
        .set('token', loginUser.body.data.token)
        .send({ ...multiRequest, status: 'accepted' });

      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/${request.body.data.id}`)
        .set('token', loginUser.body.data.token)
        .send(multiRequest);

      res.should.have.status(400);
      res.body.should.be.an('object');
    });
  });

  describe('GET /', () => {
    it('should retrieve all requests made by the users', async () => {
      const res = await chai.request(app)
        .get(`${URL_PREFIX}`)
        .set('token', loginUser.body.data.token);

      res.should.have.status(200);
      res.body.data[0].should.have.property('destination');
      res.body.data[0].should.have.property('source');
      res.body.data[0].should.have.property('tripType');
      res.body.data[0].should.have.property('returnDate');
      res.body.data[0].should.have.property('travelDate');
      res.body.data[0].should.have.property('userId');
      res.body.data[0].should.have.property('status');
    });

    it('should return 404 if the user has no requests', async () => {
      const res = await chai.request(app)
        .get(`${URL_PREFIX}`)
        .set('token', loginUser3.body.data.token);

      res.should.have.status(404);
      expect(JSON.parse(res.text).error).to.equal('You\'ve not made any requests');
    });
  });

  describe('GET /pending', () => {
    it('should retrieve all open requests made by manager\'s direct report', async () => {
      const res = await chai.request(app)
        .get(`${URL_PREFIX}/pending`)
        .set('token', manager.body.data.token);

      res.should.have.status(200);
      res.body.data.length.should.equal(3);
      res.body.data[0].should.have.property('destination');
      res.body.data[0].should.have.property('source');
      res.body.data[0].should.have.property('tripType');
      res.body.data[0].should.have.property('returnDate');
      res.body.data[0].should.have.property('travelDate');
      res.body.data[0].should.have.property('userId');
      res.body.data[0].should.have.property('status');
    });

    it('should return 404 if manager\'s direct reports has no pending orders', async () => {
      const res = await chai.request(app)
        .get(`${URL_PREFIX}/pending`)
        .set('token', manager2.body.data.token);

      res.should.have.status(404);
      expect(JSON.parse(res.text).error).to.equal('There are no pending requests');
    });

    it('should not get open request when logged in user is not a manager', async () => {
      const res = await chai.request(app)
        .get(`${URL_PREFIX}/pending`)
        .set('token', loginUser.body.data.token);

      res.should.have.status(403);
      res.body.should.be.an('object');
      res.body.error.should.equal('You are not allowed to perform this operation');
    });
  });

  describe('PATCH /respond', () => {
    it('should reject a trip request successfully when user is logged in', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/${managerRequest.body.data.id}/respond`)
        .set('token', manager.body.data.token)
        .send({ status: 'rejected' });

      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.have.property('status').eql('success');
      res.body.data.should.have.property('source');
      res.body.data.should.have.property('destination');
      res.body.data.should.have.property('tripType');
      res.body.data.should.have.property('travelDate');
      res.body.data.should.have.property('returnDate');
      res.body.data.should.have.property('reason');
      res.body.data.should.have.property('accommodation');
      res.body.data.should.have.property('status').eql('rejected');
    });

    it('should approve a trip request successfully when user is logged in', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/${managerRequest.body.data.id}/respond`)
        .set('token', manager.body.data.token)
        .send({ status: 'approved' });

      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.have.property('status').eql('success');
      res.body.data.should.have.property('source');
      res.body.data.should.have.property('destination');
      res.body.data.should.have.property('tripType');
      res.body.data.should.have.property('travelDate');
      res.body.data.should.have.property('returnDate');
      res.body.data.should.have.property('reason');
      res.body.data.should.have.property('accommodation');
      res.body.data.should.have.property('status').eql('approved');
    });

    it('should fail if request ID entered is not a valid integer', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/a/respond`)
        .set('token', manager.body.data.token)
        .send({ status: 'rejected' });

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error[0].should.equal('Request ID must be an integer greater than or equal to 1');
    });

    it('should fail if no response status is passed in the request body', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/${managerRequest.body.data.id}/respond`)
        .set('token', manager.body.data.token);

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error[0].should.equal('Please enter your response status. Should be accepted or rejected');
    });

    it('should throw not found error when request does not exist', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/144/respond`)
        .set('token', manager.body.data.token)
        .send({ status: 'rejected' });

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('Trip request not found');
    });

    it('should fail if the manager tries to respond to his own request', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/${managerRequest.body.data.id}/respond`)
        .set('token', loginManager.body.data.token)
        .send({ status: 'rejected' });

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('You cannot respond to your own request');
    });

    it('should fail if the requester is not from the manager\'s direct report', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/${managerRequest.body.data.id}/respond`)
        .set('token', manager2.body.data.token)
        .send({ status: 'approved' });

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('This request is not from your direct report');
    });

    it('should fail if the user is not a manager', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/${managerRequest.body.data.id}/respond`)
        .set('token', loginUser.body.data.token)
        .send({ status: 'rejected' });

      res.should.have.status(403);
      res.body.should.be.an('object');
      res.body.error.should.equal('You are not allowed to perform this operation');
    });

    it('should deny user access when not logged in', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/1/respond`)
        .send({ status: 'rejected' });

      res.should.have.status(401);
      res.body.should.be.an('object');
      res.body.error.should.equal('Access Denied, No token provided');
    });

    it('should deny access when token is invalid', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/1/respond`)
        .set('token', 'invalid token')
        .send({ status: 'rejected' });

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('Access Denied, Invalid token');
    });
  });

  describe('POST / ReturnTrip', () => {
    it('should return 200 if return trip was created', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/return`)
        .set('token', loginUser.body.data.token)
        .send(returnRequest);

      res.should.have.status(200);
      res.body.should.have.property('status').eql('success');
      res.body.data.should.have.property('id');
      res.body.data.should.have.property('source').eql('Lagos');
      res.body.data.should.have.property('destination').eql(['Abuja']);
      res.body.data.should.have.property('tripType').eql('return');
      res.body.data.should.have.property('status').eql('open');
      res.body.data.should.have.property('travelDate');
      res.body.data.should.have.property('returnDate');
    });

    it('should not allow more than one destination', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/return`)
        .set('token', loginUser.body.data.token)
        .send({ ...Helper.omitFields(multiRequest, ['tryType', 'travelDate']), tripType: 'return', travelDate: Date() });

      res.should.have.status(400);
      res.body.should.have.property('status').eql('error');
      res.body.error.should.equal('Return trip allow only one destination');
    });

    it('should return 400 error if trip is already booked', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/return`)
        .set('token', loginUser.body.data.token)
        .send(returnRequest);

      res.should.have.status(400);
      res.body.should.have.property('status').eql('error');
      res.body.error.should.equal('You are not allowed to make multiple request');
    });

    it('should return 400 error if trip type is not return trip', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/return`)
        .set('token', loginUser.body.data.token)
        .send({ ...returnRequest, tripType: 'oneway' });

      res.should.have.status(400);
      res.body.should.have.property('status').eql('error');
      res.body.error.should.equal('Trip type must be return trip');
    });

    it('should return 400 error if return date is not provided', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/return`)
        .set('token', loginUser.body.data.token)
        .send({ ...Helper.omitFields(returnRequest, ['returnDate']) });

      res.should.have.status(400);
      res.body.should.have.property('status').eql('error');
      res.body.error.should.equal('Return date is required');
    });

    it('should return 401 error if vaild token is not provided', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/return`)
        .set('token', 'token')
        .send(returnRequest);

      res.should.have.status(400);
      res.body.should.have.property('status').eql('error');
      res.body.error.should.equal('Access Denied, Invalid token');
    });

    it('should return 400 error if source is not provided', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/return`)
        .set('token', loginUser.body.data.token)
        .send({ ...Helper.pickFields(returnRequest, []) });

      res.should.have.status(400);
      res.body.should.have.property('status').eql('error');
      res.body.error[0].should.equal('Source is required');
      res.body.error[1].should.equal('Please select your destination(s)');
      res.body.error[2].should.equal('Travel date is required e.g YYYY-MM-DD');
      res.body.error[3].should.equal('Reason is required');
      res.body.error[4].should.equal('Accommodation is required');
    });
  });

  describe('GET /Search', () => {
    it('should return 200 if source search was successful', async () => {
      const res = await chai.request(app)
        .get(`${URL_PREFIX}/search?source=Lagos`)
        .set('token', loginUser.body.data.token);

      res.should.have.status(200);
      res.body.should.have.property('status').eql('success');
      res.should.have.status(200);
      res.body.should.have.property('status').eql('success');
      res.body.data[0].should.have.property('id');
      res.body.data[0].should.have.property('source').eql('Lagos');
      res.body.data[0].should.have.property('destination').eql(['Abuja']);
      res.body.data[0].should.have.property('travelDate');
    });

    it('should return 200 if destination search was successful', async () => {
      const res = await chai.request(app)
        .get(`${URL_PREFIX}/search?destination=Abuja`)
        .set('token', loginUser.body.data.token);

      res.should.have.status(200);
      res.body.should.have.property('status').eql('success');
      res.body.data[0].should.have.property('id');
      res.body.data[0].should.have.property('source').eql('Lagos');
      res.body.data[0].should.have.property('destination').eql(['Abuja']);
      res.body.data[0].should.have.property('travelDate');
    });

    it('should return 200 if userId search was successful', async () => {
      const res = await chai.request(app)
        .get(`${URL_PREFIX}/search?userId=${loginUser.body.data.id}`)
        .set('token', loginUser.body.data.token);

      res.should.have.status(200);
      res.body.should.have.property('status').eql('success');
      res.body.data[0].should.have.property('id');
      res.body.data[0].should.have.property('source').eql('Nigeria');
      res.body.data[0].should.have.property('travelDate');
    });

    it('should return 200 if status search was successful', async () => {
      const res = await chai.request(app)
        .get(`${URL_PREFIX}/search?status=open`)
        .set('token', loginUser.body.data.token);

      res.should.have.status(200);
      res.body.should.have.property('status').eql('success');
      res.body.data[0].should.have.property('id');
      res.body.data[0].should.have.property('source').eql('Lagos');
      res.body.data[0].should.have.property('destination').eql(['Abuja']);
      res.body.data[0].should.have.property('travelDate');
    });

    it('should return 400 error source data not found', async () => {
      const res = await chai.request(app)
        .get(`${URL_PREFIX}/search?source=0`)
        .set('token', loginUser.body.data.token);

      res.should.have.status(400);
      res.body.should.have.property('status').eql('error');
      res.body.error.should.equal('No result found');
    });

    it('should return 400 error data not found', async () => {
      const res = await chai.request(app)
        .get(`${URL_PREFIX}/search?destination=0`)
        .set('token', loginUser.body.data.token);

      res.should.have.status(400);
      res.body.should.have.property('status').eql('error');
      res.body.error.should.equal('No result found');
    });
  });
});
