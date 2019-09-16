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
let department;
let department2;
let userId;

const URL_PREFIX = '/api/v1/auth';
const superAdmin = {
  firstName: 'Super',
  lastName: 'Administrator',
  email: process.env.SUPER_ADMIN_EMAIL,
  password: process.env.SUPER_ADMIN_PASSWORD
};
const user = {
  id: 60,
  firstName: 'user',
  lastName: 'user',
  email: 'user@mail.com',
  password: 'jhgfd3456',
  roleId: 5
};


describe('Assign User Role', () => {
<<<<<<< HEAD
=======
  after(async () => {
    await TestHelper.destroyModel('Request');
    await TestHelper.destroyModel('User');
    await TestHelper.destroyModel('Role');
    await TestHelper.destroyModel('Department');
    await TestHelper.destroyModel('UserDepartment');
  });

>>>>>>> update signup endpoint to enable user select a department on signup
  before(async () => {
    await TestHelper.destroyModel('Role');
<<<<<<< HEAD
    await TestHelper.destroyModel('User');
=======
    await TestHelper.destroyModel('Department');
    await TestHelper.destroyModel('UserDepartment');
<<<<<<< HEAD
    await TestHelper.createDepartment({ department: 'dev' });
>>>>>>> update signup endpoint to enable user select a department on signup
=======
    department = await TestHelper.createDepartment({ department: 'dev' });
<<<<<<< HEAD
>>>>>>> add endpoint for super admin to add a user to a department
=======
    department2 = await TestHelper.createDepartment({ department: 'travels' });
>>>>>>> update assign manager logic
    await db.Role.bulkCreate(insertRoles);
    await TestHelper.createUser({
      ...superAdmin, roleId: 1
    });
    await TestHelper.createUser(user);
  });

  beforeEach((done) => {
    send = sinon.stub(sgMail, 'send').resolves({});
    done();
  });

  afterEach((done) => {
    send.restore();
    done();
  });

  describe('PATCH /assign_role', () => {
    it('should sign up a new user', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/signup`)
        .send({
          firstName: 'qqqq',
          lastName: 'qqqq',
          email: 'ter@trtr.com',
          password: '1111ghghjh'
        });

      const { token, id } = res.body.data;
      userToken = token;
      userId = id;

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

  describe('GET /users', async () => {
    it('should get all users super Admin is logged in', async () => {
      const res = await chai.request(app)
        .get(`${URL_PREFIX}/users`)
        .set('token', adminToken);

      res.should.have.status(200);
    });
  });

  describe('PATCH /users', async () => {
    it('should assign user to a department', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/users`)
        .set('token', adminToken)
        .send({ userId, department: department2.id });

      res.should.have.status(200);
      res.body.should.have.property('message');
      res.body.message.should.equal('User department updated successfully');
    });


    it('should throw error when user is already assigned user to that department', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/users`)
        .set('token', adminToken)
        .send({ userId, department: department2.id });

      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.error.should.equal('User is already assigned to this department');
    });

    it('should not assign user to a department when user is not found', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/users`)
        .set('token', adminToken)
        .send({ userId: 234567, department: department.id });

      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.error.should.equal('user not found');
    });

    it('should not assign user to a department when department is not found', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/users`)
        .set('token', adminToken)
        .send({ userId, department: 4566 });

      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.error.should.equal('Department not found');
    });
  });

  describe('DELETE /users', async () => {
    it('should delete users super Admin is logged in', async () => {
      const res = await chai.request(app)
        .delete(`${URL_PREFIX}/users/60`)
        .set('token', adminToken);

      res.should.have.status(200);
      res.body.should.have.property('message');
      res.body.message.should.equal('User deleted sucessfully');
    });

    it('should not delete a users when the id is wrong', async () => {
      const res = await chai.request(app)
        .delete(`${URL_PREFIX}/users/600`)
        .set('token', adminToken);

      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.error.should.equal('user not found');
    });
  });
});
