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
const URL_PREFIX_USER = '/api/v1/user';
const superAdmin = {
  first_name: 'super',
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

  describe('PATCH /user/assign_role', () => {
    before(async () => {
      await TestHelper.createUser({
        ...superAdmin, roleId: 1
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
    });

    it('should not assign role if user email is not verified', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX_USER}/5/assign_role`)
        .set('token', adminToken)
        .send({ email: 'ter@trtr.com' });

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
        .patch(`${URL_PREFIX_USER}/4/assign_role`)
        .set('token', adminToken)
        .send({ email: 'ter@trtr.com' });

      res.should.have.status(200);
      res.body.should.have.property('message');
      res.body.message.should.equal('User Role Assigned Successfully');
    });

    it('should not grant user permission if not permitted to assign role', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX_USER}/5/assign_role`)
        .set('token', userToken)
        .send({ email: 'ter@trtr.com' });

      res.should.have.status(403);
      res.body.should.have.property('message');
      res.body.message.should.equal('You are not allowed to perform this operation');
    });

    it('should not assign role if user already has that role', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX_USER}/4/assign_role`)
        .set('token', adminToken)
        .send({ email: 'ter@trtr.com' });

      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.error.should.equal('User is already assigned this role');
    });

    it('should not assign role if user email does not exist', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX_USER}/5/assign_role`)
        .set('token', adminToken)
        .send({ email: 'te@trtr.com' });

      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.error.should.equal('User not found');
    });

    it('should not assign role with invalid role parameter', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX_USER}/8/assign_role`)
        .set('token', adminToken)
        .send({ email: 'ter@trtr.com' });

      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.error.should.equal('Role does not exit, Must be between 1-6');
    });

    it('should not assign role with invalis token', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX_USER}/5/assign_role`)
        .set('token', 'ghghjghj')
        .send({ email: 'ter@trtr.com' });

      res.should.have.status(401);
      res.body.should.have.property('error');
      res.body.error.should.equal('Access Denied, Invalid or Expired Token');
    });
  });
});
