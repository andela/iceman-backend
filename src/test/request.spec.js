import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import TestHelper from '../utils/testHelper';
import Helper from '../utils/helpers';

chai.use(chaiHttp);
chai.should();

const URL_PREFIX = '/api/v1';

const returnTrip = {
  origin: 'Lagos',
  destination: 'Abuja',
  travelDate: '10/02/2019',
  returnDate: '01/01/2018',
  reason: 'Work',
  accommodation: 'Radison Blu'
};

const user = {
  email: 'user1@gmail.com',
  password: 'Ice5m5am0a843r03'
};

describe('Request Trip', () => {
  before((done) => {
    TestHelper.destroyModel('Request');
    done();
  });

  describe('POST / ReturnTrip', () => {
    let token;
    before(async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/auth/login`)
        .send(user);
      token = res.body.data.token;
    });

    it('should return 201 if return trip was created', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/requests/return`)
        .set('token', token)
        .send(returnTrip);

      res.should.have.status(201);
      res.body.data.should.have.property('origin');
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
      res.body.error.should.equal('Trip details already exist');
    });

    it('should return 401 error if vaild token is not provided', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/requests/return`)
        .set('token', 'token')
        .send(returnTrip);

      res.should.have.status(401);
      res.body.error.should.equal('Authorization failed, Please Login');
    });

    it('should return 400 error if origin is not provided', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/requests/return`)
        .set('token', token)
        .send({ ...Helper.pickFields(returnTrip, ['destination', 'travelDate', 'returnDate', 'tripType', 'reason', 'accommodation']) });

      res.should.have.status(400);
      res.body.error.should.equal('Origin is required');
    });

    it('should return 400 error if destination is not provided', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/requests/return`)
        .set('token', token)
        .send({ ...Helper.pickFields(returnTrip, ['origin', 'travelDate', 'returnDate', 'reason', 'accommodation']) });

      res.should.have.status(400);
      res.body.error.should.equal('Destination is required');
    });

    it('should return 400 error if travel date is not provided', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/requests/return`)
        .set('token', token)
        .send({ ...Helper.pickFields(returnTrip, ['origin', 'destination', 'returnDate', 'reason', 'accommodation']) });

      res.should.have.status(400);
      res.body.error.should.equal('Invalid travel date format (e.g day/month/year)');
    });

    it('should return 400 error if return date is not provided', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/requests/return`)
        .set('token', token)
        .send({ ...Helper.pickFields(returnTrip, ['origin', 'destination', 'travelDate', 'reason', 'accommodation']) });

      res.should.have.status(400);
      res.body.error.should.equal('Invalid return date format (e.g day/month/year)');
    });

    it('should return 400 error if reason is not provided', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/requests/return`)
        .set('token', token)
        .send({ ...Helper.pickFields(returnTrip, ['origin', 'destination', 'travelDate', 'returnDate', 'accommodation']) });

      res.should.have.status(400);
      res.body.error.should.equal('Reason is required');
    });

    it('should return 400 error if accommodation is required is not provided', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/requests/return`)
        .set('token', token)
        .send({ ...Helper.pickFields(returnTrip, ['origin', 'destination', 'travelDate', 'returnDate', 'reason']) });

      res.should.have.status(400);
      res.body.error.should.equal('Accommodation is required');
    });
  });
});
