import dotenv from 'dotenv';
import chai from 'chai';
import chaiHttp from 'chai-http';
import sgMail from '@sendgrid/mail';
import sinon from 'sinon';
import app from '../index';
import TestHelper from '../utils/testHelper';

dotenv.config();
chai.use(chaiHttp);
chai.should();

let send;
let userToken;
let adminToken;

const URL_PREFIX = '/api/v1/auth';
const superAdmin = {
  first_name: 'Super',
  last_name: 'Administrator',
  email: process.env.SUPER_ADMIN_EMAIL,
  password: process.env.SUPER_ADMIN_PASSWORD
};


describe('Assign User Role', () => {
  before((done) => {
    TestHelper.destroyModel('User');
    done();
  });

  after((done) => {
    TestHelper.destroyModel('Role');
    done();
  });


  beforeEach(async () => {
    send = sinon.stub(sgMail, 'send').resolves({});
  });

  afterEach(async () => {
    send.restore();
  });

  describe('PATCH /assign_role', () => {
    before(async () => {
      await TestHelper.createUser({
        ...superAdmin, role_id: 1
      });
    });

    it('should sign up a new user', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/signup`)
        .send({
          first_name: 'qqqq',
          last_name: 'qqqq',
          email: 'ter@trtr.com',
          password: '1111ghghjh'
        });

      const { token } = res.body.data;
      userToken = token;

      res.should.have.status(201);
      res.body.should.have.property('data');
      res.body.data.should.have.property('token');
      res.body.data.first_name.should.equal('qqqq');
      res.body.data.last_name.should.equal('qqqq');
      res.body.data.email.should.equal('ter@trtr.com');
    });


    it('should log in super administrator', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/login`)
        .send({
          email: process.env.SUPER_ADMIN_EMAIL,
          password: process.env.SUPER_ADMIN_PASSWORD
        });

      const { token } = res.body.data;
      adminToken = token;

      res.should.have.status(200);
      res.body.should.have.property('data');
      res.body.data.should.have.property('token');
      res.body.data.first_name.should.equal('Super');
      res.body.data.last_name.should.equal('Administrator');
    });

    it('should not assign role if user email is not verified', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/assign_role`)
        .set('token', adminToken)
        .send({ email: 'ter@trtr.com', role_id: 5 });

      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.error.should.equal('User email is not verified');
    });

    it('should verify user email address', async () => {
      const res = await chai.request(app)
        .get(`${URL_PREFIX}/verify?token=${userToken}`);

      res.should.have.status(200);
      res.body.should.have.property('message');
      res.body.message.should.equal('Email Verification Successful');
    });

    it('should assign user role', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/assign_role`)
        .set('token', adminToken)
        .send({ email: 'ter@trtr.com', role_id: 4 });

      res.should.have.status(200);
      res.body.should.have.property('message');
      res.body.message.should.equal('User Role Assigned Successfully');
    });

    it('should not grant user permission if not permitted to assign role', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/assign_role`)
        .set('token', userToken)
        .send({ email: 'ter@trtr.com', role_id: 5 });

      res.should.have.status(403);
      res.body.should.have.property('error');
      res.body.error.should.equal('You are not allowed to perform this operation');
    });

    it('should not assign role if user already has that role', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/assign_role`)
        .set('token', adminToken)
        .send({ email: 'ter@trtr.com', role_id: 4 });

      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.error.should.equal('User is already assigned this role');
    });

    it('should not assign role if user email does not exist', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/assign_role`)
        .set('token', adminToken)
        .send({ email: 'te@trtr.com', role_id: 5 });

      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.error.should.equal('User not found');
    });

    it('should not assign role with invalid role parameter', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/assign_role`)
        .set('token', adminToken)
        .send({ email: 'ter@trtr.com', role_id: 6 });

      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.error.should.equal('Invalid Role Input');
    });

    it('should not assign role with invalid token', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/assign_role`)
        .set('token', 'ghghjghj')
        .send({ email: 'ter@trtr.com', role_id: 5 });

      res.should.have.status(401);
      res.body.should.have.property('error');
      res.body.error.should.equal('Access Denied, Invalid or Expired Token');
    });

    it('should not assign role with invalid email', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/assign_role`)
        .set('token', adminToken)
        .send({ email: 'ter', role_id: 5 });

      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.error.should.equal('Email must be a valid email address e.g example@mail.com or example@mail.co.uk');
    });
  });
});
