import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import TestHelper from '../utils/testHelper';
import Helper from '../utils/helpers';

chai.use(chaiHttp);
chai.should();

const URL_PREFIX = '/api/v1';
const payload = { id: 1, email: 'cleave@mail.com', is_admin: true };
const payload2 = { id: 2, email: 'cleave2@mail.com', is_admin: true };
let verifiedUser, request1, request2, request3;
const userToken = Helper.genToken(payload);
const userToken2 = Helper.genToken(payload2);

const requestDetails = {
  source: ' lagos',
  destination: ' newyork',
  tripType: 'return',
  travelDate: '2019-08-27',
  returnDate: '2019-09-27',
  reason: 'business',
  accommodation: ' Lorem ipsum',
};

const user = {
  first_name: 'cleave',
  last_name: 'owhiroro',
  email: 'cleave@mail.com',
  password: 'cleave12345'
};

const oneWayTrip = {
  source: 'Lagos',
  destination: 'Abuja',
  travelDate: '10/02/2019',
  reason: 'Work',
  accommodation: 'Radison Blu'
};

const returnTrip = {
  source: 'Lagos',
  destination: 'Abuja',
  travelDate: '10/02/2019',
  returnDate: '01/01/2018',
  reason: 'Work',
  accommodation: 'Radison Blu'
};

describe('TRIP REQUEST ROUTE', () => {
  before(async () => {
    await TestHelper.destroyModel('User');
  });

  before(async () => {
    verifiedUser = await TestHelper.createUser({
      ...user, is_verified: true
    });
  });

  before(async () => {
    request1 = await TestHelper.createRequest({
      ...requestDetails, userId: 1
    });
    request2 = await TestHelper.createRequest({
      ...requestDetails, userId: 1, status: 'accepted'
    });
    request3 = await TestHelper.createRequest({
      ...requestDetails, userId: 1, status: 'rejected'
    });
  });

  describe('Edit Request', () => {
    it('should update an open trip request when user is logged in and required details are provided', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/requests/1`)
        .set('token', userToken)
        .send(requestDetails);

      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.have.property('status').eql('success');
      res.body.data.should.have.property('source');
      res.body.data.should.have.property('destination');
      res.body.data.should.have.property('triptype');
      res.body.data.should.have.property('traveldate');
      res.body.data.should.have.property('returndate');
      res.body.data.should.have.property('reason');
      res.body.data.should.have.property('accommodation');
    });

    it('should throw not found error when request does not exist', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/requests/144`)
        .set('token', userToken)
        .send(requestDetails);

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('Trip request not found');
    });

    it('should not be able to update the request of another user', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/requests/1`)
        .set('token', userToken2)
        .send(requestDetails);

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('You are not allowed to edit this request');
    });

    it('should deny user access when not logged in', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/requests/1`)
        .send(requestDetails);

      res.should.have.status(403);
      res.body.should.be.an('object');
      res.body.error.should.equal('Authentication failed, please login');
    });

    it('should not update a trip that has been accepted', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/requests/2`)
        .set('token', userToken)
        .send(requestDetails);

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('Request has been accepted. cannot edit');
    });

    it('should not update a trip that has been rejected', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/requests/3`)
        .set('token', userToken)
        .send(requestDetails);

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('Request has been rejected. cannot edit');
    });

    it('should deny access when token is invalid', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/requests/1`)
        .set('token', 'invalid token')
        .send(requestDetails);

      res.should.have.status(401);
      res.body.should.be.an('object');
      res.body.error.should.equal('Access Denied, Invalid or Expired Token');
    });

    it('should not update when source is not provided', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/requests/1`)
        .set('token', userToken)
        .send({
          source: ' ',
          destination: ' newyork',
          tripType: 'return',
          travelDate: '2019-08-27',
          returnDate: '2019-09-27',
          reason: 'business',
          accommodation: ' Lorem ipsum',
        });

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('Source is required');
    });

    it('should not update when destination is not provided', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/requests/1`)
        .set('token', userToken)
        .send({
          source: 'lagos ',
          destination: '',
          tripType: 'oneway',
          travelDate: '2019-08-27',
          reason: 'business',
          accommodation: ' Lorem ipsum',
        });

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('Please select your destination');
    });

    it('should not update when trip type is not provided', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/requests/1`)
        .set('token', userToken)
        .send({
          source: 'lagos ',
          destination: ' newyork',
          tripType: '',
          travelDate: '2019-08-27',
          reason: 'business',
          accommodation: ' Lorem ipsum',
        });
      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('Please select your trip type. Should be oneway, return or multicity');
    });

    it('should not update when travel date is not provided', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/requests/1`)
        .set('token', userToken)
        .send({
          source: 'lagos ',
          destination: ' newyork',
          tripType: 'return',
          travelDate: '',
          reason: 'business',
          accommodation: ' Lorem ipsum',
        });
      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('Travel date is required e.g YYYY-MM-DD');
    });

    it('should not update when reason is not provided', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/requests/1`)
        .set('token', userToken)
        .send({
          source: 'lagos',
          destination: ' newyork',
          tripType: 'return',
          travelDate: '2019-08-27',
          returnDate: '2019-09-27',
          reason: '',
          accommodation: 'Lorem ipsum',
        });
      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('Reason is required');
    });

    it('should not update when accomodation is not provided', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/requests/1`)
        .set('token', userToken)
        .send({
          source: 'lagos',
          destination: ' newyork',
          tripType: 'return',
          travelDate: '2019-08-27',
          returnDate: '2019-09-27',
          reason: 'business',
          accommodation: '',
        });
      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('Accommodation is required');
    });

    it('should not update when dates are not well formatted', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/requests/1`)
        .set('token', userToken)
        .send({
          source: 'lagos',
          destination: ' newyork',
          tripType: 'return',
          travelDate: '2019-08-27',
          returnDate: 'wrongformat',
          reason: 'business',
          accommodation: 'lorem ipsum',
        });
      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('Return date should be in YYYY-MM-DD format');
    });

    describe('POST / Oneway Trip', () => {
      it('should return 400 error if source is not provided', async () => {
        const { text, status } = await chai.request(app)
          .post(`${URL_PREFIX}/requests/oneway`)
          .set('token', userToken)
          .send({ ...Helper.pickFields(oneWayTrip, ['destination', 'travelDate', 'tripType', 'reason', 'accommodation']) });

        expect(status).to.equal(400);
        expect(JSON.parse(text).error).to.equal('Source is required');
      });

      it('should return 400 error if destination is not provided', async () => {
        const { text, status } = await chai.request(app)
          .post(`${URL_PREFIX}/requests/oneway`)
          .set('token', userToken)
          .send({ ...Helper.pickFields(oneWayTrip, ['source', 'travelDate', 'reason', 'accommodation']) });

        expect(status).to.equal(400);
        expect(JSON.parse(text).error).to.equal('Please select your destination');
      });

      it('should return 400 error if travel date is not provided', async () => {
        const { text, status } = await chai.request(app)
          .post(`${URL_PREFIX}/requests/oneway`)
          .set('token', userToken)
          .send({ ...Helper.pickFields(oneWayTrip, ['source', 'destination', 'reason', 'accommodation']) });

        expect(status).to.equal(400);
        expect(JSON.parse(text).error).to.equal('Travel date is required e.g YYYY-MM-DD');
      });

      it('should return 400 error if reason is not provided', async () => {
        const { text, status } = await chai.request(app)
          .post(`${URL_PREFIX}/requests/oneway`)
          .set('token', userToken)
          .send({ ...Helper.pickFields(oneWayTrip, ['source', 'destination', 'travelDate', 'accommodation']) });

        expect(status).to.equal(400);
        expect(JSON.parse(text).error).to.equal('Reason is required');
      });

      it('should return 400 error if accommodation is required is not provided', async () => {
        const { text, status } = await chai.request(app)
          .post(`${URL_PREFIX}/requests/oneway`)
          .set('token', userToken)
          .send({ ...Helper.pickFields(oneWayTrip, ['source', 'destination', 'travelDate', 'reason']) });

        expect(status).to.equal(400);
        expect(JSON.parse(text).error).to.equal('Accommodation is required');
      });

      it('should return 401 error if vaild token is not provided', async () => {
        const { text, status } = await chai.request(app)
          .post(`${URL_PREFIX}/requests/oneway`)
          .set('token', 'invalid token')
          .send(oneWayTrip);

        expect(status).to.equal(401);
        expect(JSON.parse(text).error).to.equal('Access Denied, Invalid or Expired Token');
      });

      it('should return 201 if one way trip was created', async () => {
        const { text, status } = await chai.request(app)
          .post(`${URL_PREFIX}/requests/oneway`)
          .set('token', userToken)
          .send(oneWayTrip);

        expect(JSON.parse(text).data.source).to.equal('Lagos');
        expect(status).to.equal(201);
      });

      it('should return 409 if the trip is already booked', async () => {
        const { text, status } = await chai.request(app)
          .post(`${URL_PREFIX}/requests/oneway`)
          .set('token', userToken)
          .send(oneWayTrip);

        expect(status).to.equal(409);
        expect(JSON.parse(text).error).to.equal('You\'ve already booked this trip');
      });

      describe('POST / ReturnTrip', () => {
        let token;
        before(async () => {
          const res = await chai.request(app)
            .post(`${URL_PREFIX}/auth/login`)
            .send(user);
          token = res.body.data.token;
          console.log(token);
        });

        it('should return 201 if return trip was created', async () => {
          const res = await chai.request(app)
            .post(`${URL_PREFIX}/requests/return`)
            .set('token', token)
            .send(returnTrip);

          res.should.have.status(201);
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('source');
          res.body.data.should.have.property('destination');
          res.body.data.should.have.property('travelDate');
          res.body.data.should.have.property('returnDate');
          res.body.data.should.have.property('tripType');
        });

        it('should return 409 error if trip is already booked', async () => {
          const res = await chai.request(app)
            .post(`${URL_PREFIX}/requests/return`)
            .set('token', token)
            .send(returnTrip);

          res.should.have.status(409);
          res.body.error.should.equal('Trip details already exists');
        });

        it('should return 401 error if vaild token is not provided', async () => {
          const res = await chai.request(app)
            .post(`${URL_PREFIX}/requests/return`)
            .set('token', 'token')
            .send(returnTrip);

          res.should.have.status(401);
          res.body.error.should.equal('Access Denied, Invalid or Expired Token');
        });

        it('should return 400 error if source is not provided', async () => {
          const res = await chai.request(app)
            .post(`${URL_PREFIX}/requests/return`)
            .set('token', token)
            .send({ ...Helper.pickFields(returnTrip, ['destination', 'travelDate', 'returnDate', 'tripType', 'reason', 'accommodation']) });

          res.should.have.status(400);
          res.body.error.should.equal('Source is required');
        });

        it('should return 400 error if destination is not provided', async () => {
          const res = await chai.request(app)
            .post(`${URL_PREFIX}/requests/return`)
            .set('token', token)
            .send({ ...Helper.pickFields(returnTrip, ['source', 'travelDate', 'returnDate', 'reason', 'accommodation']) });

          res.should.have.status(400);
          res.body.error.should.equal('Destination is required');
        });

        it('should return 400 error if travel date is not provided', async () => {
          const res = await chai.request(app)
            .post(`${URL_PREFIX}/requests/return`)
            .set('token', token)
            .send({ ...Helper.pickFields(returnTrip, ['source', 'destination', 'returnDate', 'reason', 'accommodation']) });

          res.should.have.status(400);
          res.body.error.should.equal('Travel date should be in YYYY-MM-DD format');
        });

        it('should return 400 error if return date is not provided', async () => {
          const res = await chai.request(app)
            .post(`${URL_PREFIX}/requests/return`)
            .set('token', token)
            .send({ ...Helper.pickFields(returnTrip, ['source', 'destination', 'travelDate', 'reason', 'accommodation']) });

          res.should.have.status(400);
          res.body.error.should.equal('Return date should be in YYYY-MM-DD format');
        });

        it('should return 400 error if reason is not provided', async () => {
          const res = await chai.request(app)
            .post(`${URL_PREFIX}/requests/return`)
            .set('token', token)
            .send({ ...Helper.pickFields(returnTrip, ['source', 'destination', 'travelDate', 'returnDate', 'accommodation']) });

          res.should.have.status(400);
          res.body.error.should.equal('Reason is required');
        });

        it('should return 400 error if accommodation is required is not provided', async () => {
          const res = await chai.request(app)
            .post(`${URL_PREFIX}/requests/return`)
            .set('token', token)
            .send({ ...Helper.pickFields(returnTrip, ['source', 'destination', 'travelDate', 'returnDate', 'reason']) });

          res.should.have.status(400);
          res.body.error.should.equal('Accommodation is required');
        });
      });
    });
  });
});
