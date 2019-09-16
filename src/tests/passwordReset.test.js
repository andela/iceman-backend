import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sgMail from '@sendgrid/mail';
import app from '../index';
import TestHelper from '../utils/testHelper';
import db from '../models';
import Helper from '../utils/helpers';
import insertRoles from '../utils/insertTestRoles';

chai.use(chaiHttp);

let stub;
let fakeToken;
const urlPrefix = '/api/v1';

describe('/api/v1/auth', () => {
  let passwordResetToken;

  after(async () => {
    await TestHelper.destroyModel('Request');
    await TestHelper.destroyModel('User');
    await TestHelper.destroyModel('Role');
  });

  before(async () => {
    await TestHelper.destroyModel('Request');
    await TestHelper.destroyModel('User');
    await TestHelper.destroyModel('Role');
    await db.Role.bulkCreate(insertRoles);
    fakeToken = await Helper.genToken({ email: 'fake@chubi.com' });
    await db.User.create({
      firstName: 'irellevant',
      lastName: 'Tester',
      email: 'testa@test.com',
      password: 'PasswordTest123'
    });

    await db.User.create({
      firstName: 'irellevantwww',
      lastName: 'Testerww',
      email: 'fake@chubi.com',
      password: 'PasswordTest123'
    });
  });

  beforeEach(async () => {
    stub = sinon.stub(sgMail, 'send').resolves({});
  });

  afterEach(async () => {
    stub.restore();
  });

  describe('POST /forgot_password', () => {
    it('should return an error for an unregistered user', async () => {
      const { status, text } = await chai.request(app)
        .post(`${urlPrefix}/auth/forgot_password`)
        .send({
          email: 'yahan@mail.com'
        });

      expect(status).to.equal(400);
      expect(JSON.parse(text).error).to.equal('Email not found');
    });

    it('should send a message, token and an email for a registered user', async () => {
      const { status, text } = await chai.request(app)
        .post(`${urlPrefix}/auth/forgot_password`)
        .send({
          email: 'testa@test.com'
        });

      passwordResetToken = await JSON.parse(text).data.token;

      expect(JSON.parse(text).data.token).to.equal(passwordResetToken);
      expect(status).to.equal(200);
      sinon.assert.calledOnce(stub);
    });
  });

  describe('POST /reset_password/:token', () => {
    it('should return an error for invalid password', async () => {
      const { status, text } = await chai.request(app)
        .patch(`${urlPrefix}/auth/reset_password/${passwordResetToken}`)
        .send();

      expect(JSON.parse(text).error).to.equal('Password must contain at least one letter, at least one number, and be atleast 8 digits long');
      expect(status).to.equal(400);
    });

    it('should return an error for an invalid token', async () => {
      const { status, text } = await chai.request(app)
        .patch(`${urlPrefix}/auth/reset_password/token`)
        .send({
          password: 'testa567890testcom'
        });

      expect(JSON.parse(text).error).to.equal('jwt malformed');
      expect(status).to.equal(400);
    });

    it('should return an error for an invalid token', async () => {
      const { status, text } = await chai.request(app)
        .patch(`${urlPrefix}/auth/reset_password/${fakeToken}`)
        .send({
          password: 'testa567890testcom'
        });

      expect(JSON.parse(text).error).to.equal('Invalid token');
      expect(status).to.equal(400);
    });

    it('should return a message on succesful update', async () => {
      const { status, text } = await chai.request(app)
        .patch(`${urlPrefix}/auth/reset_password/${passwordResetToken}`)
        .send({
          password: 'pas888swogrd'
        });

      expect(status).to.equal(200);
      expect(JSON.parse(text).data).to.equal('Password reset successfully');
    });
  });
});
