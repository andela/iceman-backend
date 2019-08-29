import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import TestHelper from '../utils/testHelper';
import Helper from '../utils/helpers';
import { multiRequest, missingRequiredField } from './testData/sampleData';

chai.use(chaiHttp);
chai.should();

const URL_PREFIX = '/api/v1/request';
let loginUser;

const user = {
  first_name: 'Samuel',
  last_name: 'koroh',
  email: 'user1@gmail.com',
  password: 'Ice5m5am0a843r03'
};

describe('/api/v1/request', () => {
  before((done) => {
    TestHelper.destroyModel('User');
    done();
  });

  describe('POST /multi-city', () => {
    before(async () => {
      await TestHelper.createUser({
        ...user, is_verified: true
      });

      loginUser = await chai.request(app)
        .post('/api/v1/auth/login')
        .set('Content-Type', 'application/json')
        .send(Helper.pickFields(user, ['email', 'password']));
    });

    it('should return 200 if the request finished successfully', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/multi-city`)
        .set('Content-Type', 'application/json')
        .set('token', loginUser.body.data.token)
        .send(multiRequest);

      res.should.have.status(200);
      res.body.data.request.should.have.property('destination');
      res.body.data.request.should.have.property('source');
      res.body.data.request.should.have.property('type', 'multi-city');
      res.body.data.request.should.have.property('return_date');
      res.body.data.request.should.have.property('travel_date');
    });

    it('should return 400 if pass empty requests', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/multi-city`)
        .set('Content-Type', 'application/json')
        .set('token', loginUser.body.data.token)
        .send([]);

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
});
