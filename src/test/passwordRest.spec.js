import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sgMail from '@sendgrid/mail';
import app from '../index';
import TestHelper from '../utils/testHelper';
import db from '../models';

chai.use(chaiHttp);

describe('/api/v1/auth', () => {
  let passwordResetToken;
  const stub = sinon.stub(sgMail, 'send');

  before((done) => {
    TestHelper.destroyModel('User');
    db.User.create({
      first_name: 'irellevant',
      last_name: 'Tester',
      email: 'testa@test.com',
      password: 'PasswordTest123'
    });
    done();
  });

  describe('POST /forgot_password', () => {
    it('should return an error for an unregistered user', async () => {
      const { status, text } = await chai.request(app)
        .post('/api/v1/auth/forgot_password')
        .send({
          email: 'yahan@mail.com'
        });

      expect(status).to.equal(400);
      expect(JSON.parse(text).error).to.equal('Email not found');
    });

    it('should send a message, token and an email for a registered user', async () => {
      const { status, text } = await chai.request(app)
        .post('/api/v1/auth/forgot_password')
        .send({
          email: 'testa@test.com'
        });

      passwordResetToken = await JSON.parse(text).data;
      expect(JSON.parse(text).data).to.equal(passwordResetToken);
      expect(status).to.equal(200);
      sinon.assert.calledOnce(stub);
    });
  });

  describe('POST /reset_password/:token', () => {
    it('should return an error for invalid password', async () => {
      const { status, text } = await chai.request(app)
        .patch(`/api/v1/auth/reset_password/${passwordResetToken}`)
        .send();

      expect(JSON.parse(text).error).to.equal('Provide valid password');
      expect(status).to.equal(400);
    });

    it('should return an error for an invalid token', async () => {
      const { status, text } = await chai.request(app)
        .patch('/api/v1/auth/reset_password/craptoken')
        .send({
          password: 'testa@test.com'
        });

      expect(JSON.parse(text).error).to.equal('jwt malformed');
      expect(status).to.equal(400);
    });

    it('should return an  error for invalid password', async () => {
      const { status, text } = await chai.request(app)
        .patch(`/api/v1/auth/reset_password/${passwordResetToken}`)
        .send({
          password: 'short'
        });

      expect(JSON.parse(text).error).to.equal('Provide valid password');
      expect(status).to.equal(400);
    });


    it('should return a message on succesful update', async () => {
      const { status, text } = await chai.request(app)
        .patch(`/api/v1/auth/reset_password/${passwordResetToken}`)
        .send({
          password: 'passwogrd'
        });

      expect(status).to.equal(200);
      expect(JSON.parse(text).message).to.equal('Password changed');
    });
  });
});
