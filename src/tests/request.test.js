import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import TestHelper from '../utils/testHelper';
import Helper from '../utils/helpers';
import db from '../models';
import insertRoles from '../utils/insertTestRoles';
import {
  multiRequest,
  missingRequiredField,
  oneWayTrip,
  user,
  managerUser,
} from './testData/sampleData';

chai.use(chaiHttp);
chai.should();

const URL_PREFIX = '/api/v1/requests';
let loginUser;
let loginUser2;
let loginUser3;
let loginManager;
let request;

describe('/api/v1/requests', () => {
  after(async () => {
    await TestHelper.destroyModel('Request');
    await TestHelper.destroyModel('User');
    await TestHelper.destroyModel('Role');
  });

  before(async () => {
    await TestHelper.destroyModel('Request');
    await TestHelper.destroyModel('User');
    await TestHelper.destroyModel('Role');
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
  });

  describe('POST /multi-city', () => {
    before(async () => {

    });

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
      expect(JSON.parse(text).error).to.equal('You\'ve already booked this trip');
    });

    it('should return 400 if the request is less than 2', async () => {
      const { text, status } = await chai.request(app)
        .post(`${URL_PREFIX}/multi-city`)
        .set('token', loginUser.body.data.token)
        .send(oneWayTrip);

      expect(status).to.equal(400);
      expect(JSON.parse(text).error).to.equal('Request must be more than one');
    });

    it('should return 400 if pass empty requests', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/multi-city`)
        .set('Content-Type', 'application/json')
        .set('token', loginUser.body.data.token)
        .send({});

      res.should.have.status(400);
    });

    it('should return 400 if requests type is not multi city', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/multi-city`)
        .set('Content-Type', 'application/json')
        .set('token', loginUser3.body.data.token)
        .send({ ...multiRequest, tripType: 'one-way' });

      res.should.have.status(400);
      expect(JSON.parse(res.text).error).to.equal('Trip type must be multi city');
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

    it('should return 201 if one way trip was created', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/one-way`)
        .set('token', loginUser2.body.data.token)
        .send(oneWayTrip);

      expect(JSON.parse(res.text).data.source).to.equal('Lagos');
      expect(res.status).to.equal(201);
    });

    it('should return 409 if the trip is already booked', async () => {
      const { text, status } = await chai.request(app)
        .post(`${URL_PREFIX}/one-way`)
        .set('token', loginUser2.body.data.token)
        .send(oneWayTrip);

      expect(status).to.equal(409);
      expect(JSON.parse(text).error).to.equal('You\'ve already booked this trip');
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

  describe('PATCH /reject', () => {
    it('should reject a trip request successfully when user is logged in', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/1/reject`)
        .set('token', loginManager.body.data.token);

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

    it('should fail if request ID entered is not a valid integer', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/a/reject`)
        .set('token', loginManager.body.data.token);

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error[0].should.equal('Request ID must be an integer greater than or equal to 1');
    });

    it('should throw not found error when request does not exist', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/144/reject`)
        .set('token', loginManager.body.data.token);

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('Trip request not found');
    });

    it('should fail if the user is not a manager', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/1/reject`)
        .set('token', loginUser.body.data.token);

      res.should.have.status(403);
      res.body.should.be.an('object');
      res.body.error.should.equal('You are not allowed to perform this operation');
    });

    it('should deny user access when not logged in', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/1/reject`);

      res.should.have.status(401);
      res.body.should.be.an('object');
      res.body.error.should.equal('Access Denied, No token provided');
    });

    it('should deny access when token is invalid', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/1/reject`)
        .set('token', 'invalid token');

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('Access Denied, Invalid token');
    });
  });
});
