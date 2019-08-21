import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import TestDatabase from '../utils/testDatabase';
import Helper from '../utils/helpers';

chai.use(chaiHttp);
chai.should();

const apiEndpoint = '/api/v1/auth/login';
const user = {
  email: 'user1@gmail.com',
  password: '123456'
};
describe('/api/v1/auth', () => {
  let verifiedUser, notVerifiedUser;

  before((done) => {
    TestDatabase.destroyUsers();
    done();
  });
  describe('POST /login', () => {
    before(async () => {
      verifiedUser = await TestDatabase.createUser({
        ...user,
        is_verified: true,
      });
      notVerifiedUser = await TestDatabase.createUser({
        ...user,
        email: 'user2@gmail.com',
      });
    });
    it('should return 400 if the user is not found', async () => {
      const res = await chai.request(app)
        .post(apiEndpoint)
        .set('Content-Type', 'application/json')
        .send({ email: 'email@email.com', password: 'password' });
      res.should.have.status(400);
    });
    it('should return 400 if the user account is not yet verified', async () => {
      const res = await chai.request(app)
        .post(apiEndpoint)
        .set('Content-Type', 'application/json')
        .send({ email: notVerifiedUser.email, password: user.password });
      res.should.have.status(400);
    });
    it('should return 400 if the user account is verified but password not valid', async () => {
      const res = await chai.request(app)
        .post(apiEndpoint)
        .set('Content-Type', 'application/json')
        .send({ email: verifiedUser.email, password: 'password' });
      res.should.have.status(400);
    });
    it('should return 200 if the user account is verified', async () => {
      const res = await chai.request(app)
        .post(apiEndpoint)
        .set('Content-Type', 'application/json')
        .send(Helper.pickFields(user, ['email', 'password']));
      res.should.have.status(200);
      res.body.data.should.have.property('token');
      res.body.data.should.have.property('id');
      res.body.data.should.have.property('email');
      res.body.data.should.have.property('is_admin');
      res.body.data.should.have.property('is_verified');
    });
  });
});
