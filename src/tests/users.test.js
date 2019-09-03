import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import TestHelper from '../utils/testHelper';
import Helper from '../utils/helpers';

chai.use(chaiHttp);
chai.should();

const URL_PREFIX = '/api/v1/auth';

const user = {
  first_name: 'Elijah',
  last_name: 'Enuem-Udogu',
  email: 'koppter.kom@gmail.com',
  password: 'elijah1994'
};

describe('/api/v1/auth', () => {
  let verifiedUser;

  beforeEach(async () => {
    verifiedUser = await TestHelper.createUser({
      ...user, is_verified: true
    });
  });

  afterEach((done) => {
    TestHelper.destroyModel('User');
    done();
  });

  describe('GET /profile', () => {
    it('should return 401 if there is no token in the header', async () => {
      const res = await chai.request(app)
        .get(`${URL_PREFIX}/profile`)
        .set('Content-Type', 'application/json');

      res.should.have.status(401);
      res.body.should.have.property('status').eql('error');
      res.body.should.have.property('error').eql('Authentication failed, please login');
    });

    it('should return 400 if the token in the header is invalid', async () => {
      const res = await chai.request(app)
        .get(`${URL_PREFIX}/profile`)
        .set('Content-Type', 'application/json')
        .set('token', 'lsdjlfsjdlkfjsd');

      res.should.have.status(400);
      res.body.should.have.property('status').eql('error');
      res.body.should.have.property('error').eql('Access Denied, Invalid or Expired Token');
    });

    it('should get the user\'s details successfully if all conditions are met', async () => {
      const payload = Helper.pickFields(verifiedUser, ['id', 'is_admin']);
      const token = await Helper.genToken(payload);

      const res = await chai.request(app)
        .get(`${URL_PREFIX}/profile`)
        .set('Content-Type', 'application/json')
        .set('token', token);

      res.should.have.status(200);
      res.body.should.have.property('status').eql('success');
      res.body.should.have.property('data');
      res.body.data.should.be.a('object');
      res.body.data.should.have.property('first_name').eql('Elijah');
      res.body.data.should.have.property('last_name').eql('Enuem-Udogu');
      res.body.data.should.have.property('email').eql('koppter.kom@gmail.com');
      res.body.data.should.have.property('is_admin');
      res.body.data.should.have.property('is_verified');
      res.body.data.should.have.property('role');
      res.body.data.should.have.property('gender');
      res.body.data.should.have.property('date_of_birth');
      res.body.data.should.have.property('preferred_language');
      res.body.data.should.have.property('preferred_currency');
      res.body.data.should.have.property('residential_address');
    });
  });

  describe('PATCH /profile', () => {
    const profileDetails = {
      first_name: 'Elijah',
      last_name: 'Enuem-Udogu',
      gender: 'Male',
      date_of_birth: '1994-05-20',
      preferred_language: 'English',
      residential_address: 'Benin City, Nigeria',
      preferred_currency: 'Nigerian Naira (NGN)',
    };

    it('should return 401 if there is no token in the header', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/profile`)
        .set('Content-Type', 'application/json')
        .send(profileDetails);

      res.should.have.status(401);
      res.body.should.have.property('status').eql('error');
      res.body.should.have.property('error').eql('Authentication failed, please login');
    });

    it('should return 400 if the token in the header is invalid', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/profile`)
        .set('Content-Type', 'application/json')
        .set('token', 'lsdjlfsjdlkfjsd')
        .send(profileDetails);

      res.should.have.status(400);
      res.body.should.have.property('status').eql('error');
      res.body.should.have.property('error').eql('Access Denied, Invalid or Expired Token');
    });

    it('should update the user\'s profile successfully if all conditions are met', async () => {
      const payload = Helper.pickFields(verifiedUser, ['id', 'is_admin']);
      const token = await Helper.genToken(payload);

      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/profile`)
        .set('Content-Type', 'application/json')
        .set('token', token)
        .send(profileDetails);

      res.should.have.status(200);
      res.body.should.have.property('status').eql('success');
      res.body.should.have.property('data');
      res.body.data.should.be.a('object');
      res.body.data.should.have.property('first_name').eql('Elijah');
      res.body.data.should.have.property('last_name').eql('Enuem-Udogu');
      res.body.data.should.have.property('email').eql('koppter.kom@gmail.com');
      res.body.data.should.have.property('is_admin');
      res.body.data.should.have.property('is_verified');
      res.body.data.should.have.property('role');
      res.body.data.should.have.property('gender').eql('Male');
      res.body.data.should.have.property('date_of_birth');
      res.body.data.should.have.property('preferred_language').eql('English');
      res.body.data.should.have.property('preferred_currency').eql('Nigerian Naira (NGN)');
      res.body.data.should.have.property('residential_address').eql('Benin City, Nigeria');
    });
  });
});
