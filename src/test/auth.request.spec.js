import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import Helper from '../utils/helpers';

chai.use(chaiHttp);
chai.should();

const URL_PREFIX = '/api/v1';
const payload = { id: 1, email: 'cleave@mail.com', is_admin: true };
const userToken = Helper.genToken(payload);

const requestDetails = {
  source: ' lagos',
  destination: ' newyork',
  tripType: 'return',
  travelDate: '2019-08-27',
  returnDate: '2019-09-27',
  reason: 'business',
  accommodation: ' Lorem ipsum',
};

describe('TRIP REQUEST ROUTE', () => {
  describe('Edit Request', () => {
    it('should update trip request when user is logged in and required details are provided', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/request/1`)
        .set('token', userToken)
        .send(requestDetails);

      res.should.have.status(200);
      res.body.should.be.an('object');
    });

    it('should deny user access when not logged in', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/request/1`)
        .send(requestDetails);

      res.should.have.status(403);
      res.body.should.be.an('object');
    });

    it('should update trip has been accepted or rejected', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/request/2`)
        .set('token', userToken)
        .send(requestDetails);

      res.should.have.status(400);
      res.body.should.be.an('object');
    });

    it('should update trip has been accepted or rejected', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/request/2`)
        .set('token', userToken)
        .send(requestDetails);

      res.should.have.status(400);
      res.body.should.be.an('object');
    });

    it('should not throw not found error when request does not exist', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/request/457`)
        .set('token', userToken)
        .send(requestDetails);

      res.should.have.status(400);
      res.body.should.be.an('object');
    });
    it('should deny access when token is invalid', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/request/1`)
        .set('token', 'invalid token')
        .send(requestDetails);

      res.should.have.status(401);
      res.body.should.be.an('object');
    });

    it('should not update when source is not provided', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/request/1`)
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
        .patch(`${URL_PREFIX}/request/1`)
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
        .patch(`${URL_PREFIX}/request/1`)
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
        .patch(`${URL_PREFIX}/request/1`)
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
        .patch(`${URL_PREFIX}/request/1`)
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
        .patch(`${URL_PREFIX}/request/1`)
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
        .patch(`${URL_PREFIX}/request/1`)
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
  });
});
