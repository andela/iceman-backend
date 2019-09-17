import chai from 'chai';
import chaiHttp from 'chai-http';
import sgMail from '@sendgrid/mail';
import sinon from 'sinon';
import app from '../index';
import TestHelper from '../utils/testHelper';
import Helper from '../utils/helpers';
import db from '../models';
import insertRoles from '../utils/insertTestRoles';
import {
  oneWayTrip,
  user,
} from './testData/sampleData';

chai.use(chaiHttp);
chai.should();

const URL_PREFIX = '/api/v1/requests';
const URL_NOTIFY_PREFIX = '/api/v1/notification';
let loginUser;
let requestId;
let department;
let manager;
let send;


describe('/api/v1/notification', () => {
  after(async () => {
    await TestHelper.destroyModel('Request');
    await TestHelper.destroyModel('User');
    await TestHelper.destroyModel('Role');
    await TestHelper.destroyModel('Department');
    await TestHelper.destroyModel('UserDepartment');
    await TestHelper.destroyModel('Notification');
  });

  before(async () => {
    await TestHelper.destroyModel('Request');
    await TestHelper.destroyModel('User');
    await TestHelper.destroyModel('Role');
    await TestHelper.destroyModel('Department');
    await TestHelper.destroyModel('UserDepartment');
    await TestHelper.destroyModel('Notification');
    await db.Role.bulkCreate(insertRoles);

    await TestHelper.createUser({
      ...user, email: 'manager@gmail.com', roleId: 4
    });

    await TestHelper.createUser({
      ...user, roleId: 5
    });

    loginUser = await chai.request(app)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send(Helper.pickFields(user, ['email', 'password']));

    manager = await chai.request(app)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send({ email: 'manager@gmail.com', password: user.password });

    department = await TestHelper.createDepartment({ department: 'dev', manager: manager.body.data.id });

    await TestHelper.createUserDepartment({
      userId: loginUser.body.data.id,
      departmentId: department.id
    });

    await TestHelper.createUserDepartment({
      userId: manager.body.data.id,
      departmentId: department.id
    });
  });

  beforeEach(async () => {
    send = await sinon.stub(sgMail, 'send').resolves({});
  });

  afterEach(async () => {
    await send.restore();
  });


  it('should send a notification when a request is made', async () => {
    const res = await chai.request(app)
      .post(`${URL_PREFIX}/one-way`)
      .set('token', loginUser.body.data.token)
      .send({ ...oneWayTrip, rememberProfile: false });

    requestId = res.body.data.id;

    res.should.have.status(201);
    res.body.data.should.have.property('destination');
    res.body.data.should.have.property('source');
    res.body.data.should.have.property('tripType', 'one-way');
    res.body.data.should.have.property('returnDate');
    res.body.data.should.have.property('travelDate');
    res.body.data.should.have.property('userId');
    res.body.data.should.have.property('gender');
    res.body.data.should.have.property('preferredLanguage');
    res.body.data.should.have.property('preferredCurrency');
    res.body.data.should.have.property('residentialAddress');
  });

  it('should send a notification when a request is approved', async () => {
    const res = await chai.request(app)
      .patch(`${URL_PREFIX}/${requestId}/respond`)
      .set('token', manager.body.data.token)
      .send({ status: 'approved' });

    res.should.have.status(200);
    res.body.should.be.an('object');
    res.body.should.have.property('status').eql('success');
    res.body.data.should.have.property('source');
    res.body.data.should.have.property('destination');
    res.body.data.should.have.property('tripType');
    res.body.data.should.have.property('travelDate');
    res.body.data.should.have.property('returnDate');
    res.body.data.should.have.property('reason');
    res.body.data.should.have.property('accommodation');
    res.body.data.should.have.property('status').eql('approved');
  });

  it('should view notification for a new request', async () => {
    const res = await chai.request(app)
      .get(`${URL_NOTIFY_PREFIX}/`)
      .set('token', manager.body.data.token);

    res.should.have.status(200);
    res.body.should.be.an('object');
    res.body.should.have.property('status').eql('success');
    res.body.data[0].should.have.property('type').eql('newRequest');
    res.body.data[0].should.have.property('url');
    res.body.data[0].should.have.property('message');
    res.body.data[0].should.have.property('receiverId');
  });

  it('should veiw notification for approved request', async () => {
    const res = await chai.request(app)
      .get(`${URL_NOTIFY_PREFIX}/2`)
      .set('token', loginUser.body.data.token);

    res.should.have.status(200);
    res.body.should.be.an('object');
    res.body.should.have.property('status').eql('success');
    res.body.data.should.have.property('type').eql('approvedRequest');
    res.body.data.should.have.property('url');
    res.body.data.should.have.property('message');
    res.body.data.should.have.property('receiverId');
  });

  it('should not view a notification that does not exist', async () => {
    const res = await chai.request(app)
      .get(`${URL_NOTIFY_PREFIX}/6`)
      .set('token', loginUser.body.data.token);

    res.should.to.have.status(400);
    res.body.error.should.equal('Notification Not Found');
  });

  it('should opt-out of email notification', async () => {
    const res = await chai.request(app)
      .patch(`${URL_NOTIFY_PREFIX}/opt_email`)
      .set('token', manager.body.data.token)
      .send({ emailNotification: 'false' });

    res.should.have.status(200);
    res.body.data.should.equal('Email Notification status successfully updated');
  });

  it('should send notification for a new request', async () => {
    const res = await chai.request(app)
      .post(`${URL_PREFIX}/one-way`)
      .set('token', loginUser.body.data.token)
      .send({ ...oneWayTrip, travelDate: 2020 - 11 - 1 });

    res.should.have.status(201);
    res.body.data.should.have.property('destination');
    res.body.data.should.have.property('source');
    res.body.data.should.have.property('tripType', 'one-way');
    res.body.data.should.have.property('returnDate');
    res.body.data.should.have.property('travelDate');
    res.body.data.should.have.property('userId');
    res.body.data.should.have.property('gender');
    res.body.data.should.have.property('preferredLanguage');
    res.body.data.should.have.property('preferredCurrency');
    res.body.data.should.have.property('residentialAddress');
  });

  it('should mark all notification as read', async () => {
    const res = await chai.request(app)
      .patch(`${URL_NOTIFY_PREFIX}/mark_all_read`)
      .set('token', manager.body.data.token);

    res.should.to.have.status(200);
    res.body.data.should.equal('All Notification Marked As Read');
  });

  it('should not mark notification as read if isRead is true', async () => {
    const res = await chai.request(app)
      .patch(`${URL_NOTIFY_PREFIX}/mark_all_read`)
      .set('token', manager.body.data.token);

    res.should.to.have.status(400);
    res.body.error.should.equal('No Unread Notification Found');
  });

  it('should clear all notification', async () => {
    const res = await chai.request(app)
      .delete(`${URL_NOTIFY_PREFIX}/clear`)
      .set('token', manager.body.data.token);

    res.should.to.have.status(200);
    res.body.data.should.equal('Notification Cleared');
  });

  it('should not clear notification if it has already been deleted', async () => {
    const res = await chai.request(app)
      .delete(`${URL_NOTIFY_PREFIX}/clear`)
      .set('token', manager.body.data.token);

    res.should.to.have.status(400);
    res.body.error.should.equal('No Notification Found');
  });

  it('should not view notification if it has been cleared', async () => {
    const res = await chai.request(app)
      .get(`${URL_NOTIFY_PREFIX}/`)
      .set('token', manager.body.data.token);

    res.should.to.have.status(400);
    res.body.error.should.equal('No notification Found');
  });

  it('should not opt-in for email notification if user does not exist', async () => {
    const nonExistentUserToken = Helper.genToken({ id: 400, roleId: 5 });
    const res = await chai.request(app)
      .patch(`${URL_NOTIFY_PREFIX}/opt_email`)
      .set('token', nonExistentUserToken)
      .send({ emailNotification: true });

    res.should.to.have.status(400);
    res.body.error.should.equal('User not Found');
  });
});
