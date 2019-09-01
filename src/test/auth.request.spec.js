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
    it('should update an open trip request when user is logged in and required details are provided', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/requests/11`)
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

    it('should deny user access when not logged in', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/requests/11`)
        .send(requestDetails);

      res.should.have.status(403);
      res.body.should.be.an('object');
      res.body.error.should.equal('Authentication failed, please login');
    });

    it('should not update a trip that has been accepted', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/requests/22`)
        .set('token', userToken)
        .send(requestDetails);

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('Request has been accepted. cannot edit');
    });

    it('should not update a trip that has been rejected', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/requests/33`)
        .set('token', userToken)
        .send(requestDetails);

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('Request has been rejected. cannot edit');
    });

    it('should not throw not found error when request does not exist', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/requests/457`)
        .set('token', userToken)
        .send(requestDetails);

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('Trip request not found');
    });

    it('should deny access when token is invalid', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/requests/11`)
        .set('token', 'invalid token')
        .send(requestDetails);

      res.should.have.status(401);
      res.body.should.be.an('object');
      res.body.error.should.equal('Access Denied, Invalid or Expired Token');
    });

    it('should not update when source is not provided', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/requests/11`)
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
        .patch(`${URL_PREFIX}/requests/11`)
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
        .patch(`${URL_PREFIX}/requests/11`)
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
        .patch(`${URL_PREFIX}/requests/11`)
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
        .patch(`${URL_PREFIX}/requests/11`)
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
        .patch(`${URL_PREFIX}/requests/11`)
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
        .patch(`${URL_PREFIX}/requests/11`)
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
