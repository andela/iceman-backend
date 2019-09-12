import dotenv from 'dotenv';
import chai from 'chai';
import chaiHttp from 'chai-http';
import sgMail from '@sendgrid/mail';
import sinon from 'sinon';
import app from '../index';
import TestHelper from '../utils/testHelper';
import db from '../models';
import insertRoles from '../utils/insertTestRoles';

dotenv.config();
chai.use(chaiHttp);
chai.should();

let send;
let userToken;
let adminToken;

const URL_PREFIX = '/api/v1/auth';
const superAdmin = {
  firstName: 'Super',
  lastName: 'Administrator',
  email: process.env.SUPER_ADMIN_EMAIL,
  password: process.env.SUPER_ADMIN_PASSWORD
};


describe('Assign User Role', () => {
  before(async () => {
    await TestHelper.destroyModel('Request');
    await TestHelper.destroyModel('User');
    await TestHelper.destroyModel('Role');
    await db.Role.bulkCreate(insertRoles);
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
        ...superAdmin, roleId: 1
      });
    });

    it('should sign up a new user', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/signup`)
        .send({
          firstName: 'qqqq',
          lastName: 'qqqq',
          email: 'ter@trtr.com',
          password: '1111ghghjh'
        });

      const { token } = res.body.data;
      userToken = token;

      res.should.have.status(201);
      res.body.should.have.property('data');
      res.body.data.should.have.property('token');
      res.body.data.firstName.should.equal('qqqq');
      res.body.data.lastName.should.equal('qqqq');
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
      res.body.data.firstName.should.equal('Super');
      res.body.data.lastName.should.equal('Administrator');
    });

    it('should not assign role if user email is not verified', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/assign_role`)
        .set('token', adminToken)
        .send({ email: 'ter@trtr.com', roleId: 5 });

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
        .send({ email: 'ter@trtr.com', roleId: 4 });

      res.should.have.status(200);
      res.body.should.have.property('message');
      res.body.message.should.equal('User Role Assigned Successfully');
    });

    it('should not grant user permission if not permitted to assign role', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/assign_role`)
        .set('token', userToken)
        .send({ email: 'ter@trtr.com', roleId: 5 });

      res.should.have.status(403);
      res.body.should.have.property('error');
      res.body.error.should.equal('You are not allowed to perform this operation');
    });

    it('should not assign role if user already has that role', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/assign_role`)
        .set('token', adminToken)
        .send({ email: 'ter@trtr.com', roleId: 4 });

      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.error.should.equal('User is already assigned this role');
    });

    it('should not assign role if user email does not exist', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/assign_role`)
        .set('token', adminToken)
        .send({ email: 'te@trtr.com', roleId: 5 });

      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.error.should.equal('User not found');
    });

    it('should not assign role with invalid role parameter', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/assign_role`)
        .set('token', adminToken)
        .send({ email: 'ter@trtr.com', roleId: 6 });

      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.error.should.equal('Invalid Role Input');
    });

    it('should not assign role with invalid token', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/assign_role`)
        .set('token', 'ghghjghj')
        .send({ email: 'ter@trtr.com', roleId: 5 });

      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.error.should.equal('Access Denied, Invalid token');
    });

    it('should not assign role with invalid email', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/assign_role`)
        .set('token', adminToken)
        .send({ email: 'ter', roleId: 5 });

      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.error.should.equal('Email must be a valid email address e.g example@mail.com or example@mail.co.uk');
    });
  });

  // describe('Remember and get user profile information', () => {
  //   it('should not remember profile with invalid token', async () => {
  //     const res = await chai.request(app)
  //       .patch(`${URL_PREFIX}/remember_profile`);

  //     res.should.have.status(401);
  //     res.body.should.have.property('error');
  //     res.body.error.should.equal('Access Denied, No token provided');
  //   });

  //   it('should remember user profile information', async () => {
  //     const res = await chai.request(app)
  //       .patch(`${URL_PREFIX}/remember_profile`)
  //       .set('token', userToken)
  //       .send({ rememberProfile: 'true' });

  //     res.should.have.status(200);
  //     res.body.should.have.property('message');
  //     res.body.message.should.equal('Remember Profile Information Successfully Updated');
  //   });

  //   it('should get user information if remember profile is true', async () => {
  //     const res = await chai.request(app)
  //       .get(`${URL_PREFIX}/user_information`)
  //       .set('token', userToken);

  //     res.should.have.status(200);
  //     res.body.should.have.property('data');
  //     res.body.data.should.have.property('roleId');
  //   });

  //   it('should change remember profile settings to false', async () => {
  //     const res = await chai.request(app)
  //       .patch(`${URL_PREFIX}/remember_profile`)
  //       .set('token', userToken)
  //       .send({ rememberProfile: 'false' });

  //     res.should.have.status(200);
  //     res.body.should.have.property('message');
  //     res.body.message.should.equal('Remember Profile Information Successfully Updated');
  //   });

  //   it('should not get user information if remember profile is false', async () => {
  //     const res = await chai.request(app)
  //       .get(`${URL_PREFIX}/user_information`)
  //       .set('token', userToken);

  //     res.should.have.status(400);
  //     res.body.should.have.property('error');
  //     res.body.error.should.equal('This feature is not enabled');
  //   });

  //   it('should not remember profile with wrong input', async () => {
  //     const res = await chai.request(app)
  //       .patch(`${URL_PREFIX}/remember_profile`)
  //       .set('token', userToken)
  //       .send({ rememberProfile: '' });

  //     res.should.have.status(400);
  //     res.body.should.have.property('error');
  //     res.body.error.should.equal('Input should either be true or false');
  //   });

  //   it('should not get user details with invalid token', async () => {
  //     const res = await chai.request(app)
  //       .get(`${URL_PREFIX}/user_information`);

  //     res.should.have.status(401);
  //     res.body.should.have.property('error');
  //     res.body.error.should.equal('Access Denied, No token provided');
  //   });
  // });
});
