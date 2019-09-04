import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import TestHelper from '../utils/testHelper';
import Helper from '../utils/helpers';
import { multiRequest, missingRequiredField } from './testData/sampleData';

chai.use(chaiHttp);
chai.should();

const URL_PREFIX = '/api/v1/requests';
let loginUser;
let loginUser2;
let request;

const user = {
  first_name: 'Samuel',
  last_name: 'koroh',
  email: 'user1@gmail.com',
  password: 'Ice5m5am0a843r03'
};

const oneWayTrip = {
  source: 'Lagos',
  trip_type: 'one-way',
  destination: ['Abuja'],
  travel_date: '2038-01-19 03:14:07',
  return_date: '2038-01-19 03:14:07',
  reason: 'reason',
  accommodation: 'accommodation'
};

describe('/api/v1/requests', () => {
  before((done) => {
    TestHelper.destroyModel('User');
    TestHelper.destroyModel('Request');
    done();
  });

  describe('POST /multi-city', () => {
    before(async () => {
      await TestHelper.createUser({
        ...user, is_verified: true
      });

      await TestHelper.createUser({
        ...user, email: 'user2@gmail.com', is_verified: true
      });

      loginUser = await chai.request(app)
        .post('/api/v1/auth/login')
        .set('Content-Type', 'application/json')
        .send(Helper.pickFields(user, ['email', 'password']));

      loginUser2 = await chai.request(app)
        .post('/api/v1/auth/login')
        .set('Content-Type', 'application/json')
        .send({ email: 'user2@gmail.com', password: user.password });

      request = await chai.request(app)
        .post(`${URL_PREFIX}/multi-city`)
        .set('Content-Type', 'application/json')
        .set('token', loginUser.body.data.token)
        .send(multiRequest);
    });

    it('should return 200 if the request finished successfully', async () => {
      request.should.have.status(200);
      request.body.data.should.have.property('destination');
      request.body.data.should.have.property('source');
      request.body.data.should.have.property('trip_type', 'multi-city');
      request.body.data.should.have.property('return_date');
      request.body.data.should.have.property('travel_date');
      request.body.data.should.have.property('user_id');
    });

    it('should return 409 if the trip is already booked', async () => {
      const { text, status } = await chai.request(app)
        .post(`${URL_PREFIX}/multi-city`)
        .set('token', loginUser.body.data.token)
        .send(multiRequest);

      expect(status).to.equal(409);
      expect(JSON.parse(text).error).to.equal('You\'ve already booked this trip');
    });

    it('should return 400 if pass empty requests', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/multi-city`)
        .set('Content-Type', 'application/json')
        .set('token', loginUser.body.data.token)
        .send({});

      res.should.have.status(400);
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
      res.body.data.should.have.property('trip_type');
      res.body.data.should.have.property('travel_date');
      res.body.data.should.have.property('return_date');
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
      res.body.data.should.have.property('trip_type');
      res.body.data.should.have.property('travel_date');
      res.body.data.should.have.property('return_date');
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
});