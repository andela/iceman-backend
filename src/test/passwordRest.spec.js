import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import TestHelper from '../utils/testHelper';
import db from '../models';

chai.use(chaiHttp);
chai.should();


describe('/api/v1/auth', () => {
  let passwordResetToken;

  before((done) => {
    TestHelper.destroyModel('User');
    done();
  });
  describe('POST /forgot_password', () => {
    before(async () => {
      await db.User.create({
        first_name: 'irellevant',
        last_name: 'Tester',
        email: 'testa@test.com',
        password: 'PasswordTest123'
      });
    });
    it('should return an error for an unregistered user', async () => {
      const { status, text } = await chai.request(app)
        .post('/api/v1/auth/forgot_password')
        .send({
          email: 'yahan@mail.com'
        });
      expect(status).to.equal(404);
      expect(JSON.parse(text).message).to.equal('Email not found');
    });
    it('should send a message, token and an email for a registered user', async () => {
      const { status, text } = await chai.request(app)
        .post('/api/v1/auth/forgot_password')
        .send({
          email: 'testa@test.com'
        });
      passwordResetToken = JSON.parse(text).token;
      expect(JSON.parse(text).token).to.equal(passwordResetToken);
      expect(status).to.equal(200);
    });
  });
  describe('POST /resetPassword/:token', () => {
    it('should return a message on succesful update', async () => {
      const { status, text } = await chai.request(app)
        .patch(`/api/v1/auth/reset_password/${passwordResetToken}`)
        .send({
          password: 'password'
        });
      expect(status).to.equal(200);
      expect(JSON.parse(text).message).to.equal('Password changed');
    });
    it('should return an error for an invalid token', async () => {
      const { status, text } = await chai.request(app)
        .patch('/api/v1/auth/reset_password/craptoken')
        .send({
          password: 'testa@test.com'
        });
      expect(JSON.parse(text).error).to.equal('Token Expired');
      expect(status).to.equal(403);
    });
  });
});
