import dotenv from 'dotenv';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import TestHelper from '../utils/testHelper';
import db from '../models';
import insertRoles from '../utils/insertTestRoles';

dotenv.config();
chai.use(chaiHttp);
chai.should();

let userToken;
let superAdminToken;
let department;

const URL_PREFIX = '/api/v1/departments';

const superAdmin = {
  firstName: 'Super',
  lastName: 'Administrator',
  email: 'superadmin@gmail.com',
  password: 'super12345',
  roleId: 1
};

const user = {
  firstName: 'regular',
  lastName: 'user',
  email: 'regularUser@mail.com',
  password: 'jhgfd3456',
  roleId: 5
};


describe('Department Endpoints', () => {
  after(async () => {
    await TestHelper.destroyModel('Request');
    await TestHelper.destroyModel('User');
    await TestHelper.destroyModel('Role');
    await TestHelper.destroyModel('Department');
  });

  before(async () => {
    await TestHelper.destroyModel('Request');
    await TestHelper.destroyModel('User');
    await TestHelper.destroyModel('Department');
    await TestHelper.destroyModel('Role');
    await db.Role.bulkCreate(insertRoles);
    await TestHelper.createUser(superAdmin);
    await TestHelper.createUser(user);
    department = await TestHelper.createDepartment({ department: 'dev', manager: 4 });

    userToken = await chai.request(app)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send({ email: 'regularUser@mail.com', password: 'jhgfd3456' });

    superAdminToken = await chai.request(app)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send({ email: 'superadmin@gmail.com', password: 'super12345' });
  });

  describe('PATCH /departments', async () => {
    it('Super Admin should be able to assign user as manager to a department', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/manager`)
        .set('token', superAdminToken.body.data.token)
        .send({ userId: userToken.body.data.id, department: 'dev' });

      res.should.have.status(200);
      res.body.should.have.property('message');
      res.body.message.should.equal('regular user is now the manager of dev department');
    });

    it('Should throw error if super Admin is not logged in', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/manager`)
        .set('token', userToken.body.data.token)
        .send({ userId: userToken.body.data.id, department: 'dev' });

      res.should.have.status(403);
      res.body.should.have.property('error');
      res.body.error.should.equal('You are not allowed to perform this operation');
    });

    it('Should throw error if user tobe assigned does not exist', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/manager`)
        .set('token', superAdminToken.body.data.token)
        .send({ userId: 500, department: 'dev' });

      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.error.should.equal('User not found');
    });

    it('Should throw error if department does not exist', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/manager`)
        .set('token', superAdminToken.body.data.token)
        .send({ userId: userToken.body.data.id, department: 'devdepartment' });

      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.error.should.equal('Department not found');
    });
  });

  describe('GET /departments', async () => {
    it('should get all departments', async () => {
      const res = await chai.request(app)
        .get(`${URL_PREFIX}`);

      res.should.have.status(200);
      res.body.data.length.should.equal(1);
      res.body.data[0].should.have.property('manager');
    });

    await TestHelper.destroyModel('Department');

    it('should throw error when no department is found', async () => {
      const res = await chai.request(app)
        .get(`${URL_PREFIX}`);

      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.error.should.equal('There are currently no departments');
    });
  });
});
