import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import TestHelper from '../utils/testHelper';
import Helper from '../utils/helpers';

chai.use(chaiHttp);
chai.should();

const URL_PREFIX = '/api/v1/auth';

const user = {
  first_name: 'Samuel',
  last_name: 'koroh',
  email: 'user1@gmail.com',
  password: 'Ice5m5am0a843r03'
};

const user2 = {
  first_name: 'Test',
  last_name: 'Tester',
  email: 'test@test.com',
  password: 'PasswordTest123'
};

describe('/api/v1/auth', () => {
  let verifiedUser, notVerifiedUser;

  before((done) => {
    TestHelper.destroyModel('User');
    done();
  });

  describe('POST /login', () => {
    before(async () => {
      verifiedUser = await TestHelper.createUser({
        ...user, is_verified: true
      });

      notVerifiedUser = await TestHelper.createUser({
        ...user,
        email: 'user2@gmail.com',
      });
    });

    it('should return 400 if the user is not found', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/login`)
        .set('Content-Type', 'application/json')
        .send({ email: 'email@email.com', password: 'password' });

      res.should.have.status(400);
    });

    it('should return 400 if the user account is not yet verified', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/login`)
        .set('Content-Type', 'application/json')
        .send({ email: notVerifiedUser.email, password: user.password });

      res.should.have.status(400);
    });

    it('should return 400 if the user account is verified but password not valid', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/login`)
        .set('Content-Type', 'application/json')
        .send({ email: verifiedUser.email, password: 'password' });

      res.should.have.status(400);
    });

    it('should return 200 if the user account is verified', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/login`)
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

  describe('Social Login Test', () => {
    it('Should return 200 if user is authenticated with Google', async () => {
      const res = await chai.request(app).get(`${URL_PREFIX}/google/callback`);

      res.should.have.status(200);
      res.body.data.should.have.property('token');
      res.body.data.should.have.property('id');
      res.body.data.should.have.property('email');
      res.body.data.should.have.property('is_admin');
      res.body.data.should.have.property('is_verified');
    });

    it('Should return 200 if user is authenticated with Facebook', async () => {
      const res = await chai.request(app).get(`${URL_PREFIX}/facebook/callback`);

      res.should.have.status(200);
      res.body.data.should.have.property('token');
      res.body.data.should.have.property('id');
      res.body.data.should.have.property('email');
      res.body.data.should.have.property('is_admin');
      res.body.data.should.have.property('is_verified');
    });
  });

  describe('POST /signup', () => {
    it('should return error if user email already exist', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/signup`)
        .set('Content-Type', 'application/json')
        .send(user);

      res.should.have.status(409);
      res.body.should.have.property('status').eql('error');
    });

    it('should return 201 if user account was created', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/signup`)
        .set('Content-Type', 'application/json')
        .send(user2);

      res.should.have.status(201);
      res.body.should.have.property('status').eql('success');
      res.body.data.should.have.property('token');
      res.body.data.should.have.property('id');
      res.body.data.should.have.property('email');
      res.body.data.should.have.property('is_admin');
      res.body.data.should.have.property('is_verified');
    });
  });

  describe('SIGNUP INPUT VALIDATION', () => {
    it('should not register a user when all required fields are empty', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/signup`)
        .send({
          first_name: '',
          last_name: '',
          email: '',
          password: '',
        });

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('First Name is required');
    });

    it('should not register a user when last name are provided', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/signup`)
        .send({
          first_name: 'john',
          last_name: '',
          email: 'doe@mail.com',
          password: 'john12345',
        });

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('Last Name is required');
    });

    it('should not register a user when email is not provided', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/signup`)
        .send({
          first_name: 'john',
          last_name: 'doe',
          email: '',
          password: '',
        });

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('Email must be a valid email address e.g example@mail.com or example@mail.co.uk');
    });

    it('should not register a user when password is not provided', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/signup`)
        .send({
          first_name: 'john',
          last_name: 'doe',
          email: 'doe@mail.com',
          password: '',
        });

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('Password must contain at least one letter, at least one number, and be atleast 8 digits long');
    });

    it('should not register a user when a valid email is not provided', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/signup`)
        .send({
          first_name: 'john',
          last_name: 'doe',
          email: 'doemail.com',
          password: '123345678',
        });

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('Email must be a valid email address e.g example@mail.com or example@mail.co.uk');
    });

    it('should not register a user when password is not a mixture of numbers and letters and atleast 8 characters long', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/signup`)
        .send({
          first_name: 'john',
          last_name: 'doe',
          email: 'doe@mail.com',
          password: '123345678',
        });

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('Password must contain at least one letter, at least one number, and be atleast 8 digits long');
    });
  });
});
