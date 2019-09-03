import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import Helper from '../utils/helpers';

chai.use(chaiHttp);
chai.should();

const URL_PREFIX = '/api/v1';

const oneWayTrip = {
  source: 'Lagos',
  destination: 'Abuja',
  travelDate: '10/02/2019',
  reason: 'Work',
  accommodation: 'Radison Blu'
};

const payload = { id: 1, email: 'cleave@mail.com', is_admin: true };
const userToken = Helper.genToken(payload);

describe('Request Trip', async () => {
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
        .set('token', 'token')
        .send(oneWayTrip);

      expect(status).to.equal(401);
      expect(JSON.parse(text).error).to.equal('jwt malformed');
    });

    it('should return 201 if one way trip was created', async () => {
      const { text, status } = await chai.request(app)
        .post(`${URL_PREFIX}/requests/oneway`)
        .set('token', userToken)
        .send(oneWayTrip);

      expect(JSON.parse(text).data.source).to.equal('Lagos');
      expect(status).to.equal(201);
    });

    it('should return 409 error if trip is already booked', async () => {
      const { text, status } = await chai.request(app)
        .post(`${URL_PREFIX}/requests/oneway`)
        .set('token', userToken)
        .send(oneWayTrip);

      expect(JSON.parse(text).error).to.equal('You\'ve already booked this trip');
      expect(status).to.equal(409);
    });
  });
});
