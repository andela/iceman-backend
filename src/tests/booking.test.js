import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import TestHelper from '../utils/testHelper';
import Helper from '../utils/helpers';
import { user, returnRequest, book } from './testData/sampleData';
import db from '../models';
import insertRoles from '../utils/insertTestRoles';

chai.use(chaiHttp);
chai.should();

const URL_PREFIX = '/api/v1';
let loginUser;
let loginUser2;
let accommodation;
let request;
let request2;
let room;

describe('POST /Bookings', () => {
  const filePath = `${__dirname}/testData/house.png`;

  before(async () => {
    await TestHelper.destroyModel('Role');
    await TestHelper.destroyModel('Room');
    await TestHelper.destroyModel('Accommodation');
    await TestHelper.destroyModel('Request');
    await TestHelper.destroyModel('User');
    db.Role.bulkCreate(insertRoles);
    await TestHelper.createUser({
      ...user, roleId: 2
    });

    await TestHelper.createUser({
      ...user, email: 'user2@gmail.com', roleId: 2
    });
    loginUser = await chai.request(app)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send(Helper.pickFields(user, ['email', 'password']));

    loginUser2 = await chai.request(app)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send({ email: 'user2@gmail.com', password: user.password });

    request = await chai.request(app)
      .post(`${URL_PREFIX}/requests/return`)
      .set('token', loginUser2.body.data.token)
      .send(returnRequest);

    request2 = await chai.request(app)
      .post(`${URL_PREFIX}/requests/return`)
      .set('token', loginUser.body.data.token)
      .send(returnRequest);

    accommodation = await chai.request(app)
      .post(`${URL_PREFIX}/accommodation`)
      .set('token', loginUser.body.data.token)
      .field('name', 'Royal Guest House')
      .field('country', 'Nigeria')
      .field('state', 'Ibadan')
      .field('city', 'Ojoo')
      .field('address', '20 agodi oojoo')
      .field('description', 'Nice one')
      .attach('image', filePath);

    room = await chai.request(app)
      .post(`${URL_PREFIX}/accommodation/${accommodation.body.data.id}/room`)
      .set('token', loginUser.body.data.token)
      .field('name', 'Room 1')
      .field('roomType', 'single')
      .field('facilities', 'ac, tv, chair')
      .attach('images', filePath);
  });

  describe('POST Booking', () => {
    it('should return 200 if the booking was added successfully', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/bookings/create/${request.body.data.id}/${accommodation.body.data.id}`)
        .set('token', loginUser2.body.data.token)
        .send({ ...book, roomId: room.body.data.id });

      res.should.have.status(200);
      res.body.should.property('status').eql('success');
    });

    it('should return 400 if book information is not provided', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/bookings/create/${request.body.data.id}/${accommodation.body.data.id}`)
        .set('token', loginUser2.body.data.token)
        .send({});

      res.should.have.status(400);
      res.body.should.have.property('status').eql('error');
      res.body.error[0].should.equal('Please select a room');
      res.body.error[1].should.equal('Check in date is required e.g YYYY-MM-DD');
      res.body.error[2].should.equal('Check out date is required e.g YYYY-MM-DD');
    });

    it('should return 400 if invalid requestId is passed', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/bookings/create/100/${accommodation.body.data.id}`)
        .set('token', loginUser2.body.data.token)
        .send({ ...book, roomId: room.body.data.id });

      res.should.have.status(400);
      res.body.should.have.property('status').eql('error');
      res.body.error.should.equal('You don\'t a vaild request');
    });

    it('should return 400 if invalid accommodationId is passed', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/bookings/create/${request.body.data.id}/100`)
        .set('token', loginUser2.body.data.token)
        .send({ ...book, roomId: room.body.data.id });

      res.should.have.status(400);
      res.body.should.have.property('status').eql('error');
      res.body.error.should.equal('You have not selected an existing accommodation');
    });

    it('should return 400 if the user already book an accommodation', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/bookings/create/${request.body.data.id}/${accommodation.body.data.id}`)
        .set('token', loginUser2.body.data.token)
        .send({ ...book, roomId: room.body.data.id });

      res.should.have.status(400);
      res.body.should.have.property('status').equal('error');
      res.body.error.should.equal('You\'ve already book an accommodation for this trip');
    });

    it('should return 400 if room is already booked', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/bookings/create/${request2.body.data.id}/${accommodation.body.data.id}`)
        .set('token', loginUser.body.data.token)
        .send({ ...book, roomId: room.body.data.id });

      res.should.have.status(400);
      res.body.should.have.property('status').equal('error');
      res.body.error.should.equal('Selected room is already booked');
    });
  });

  describe('POST Booking', () => {
    it('should return 200 if user have bookings', async () => {
      const res = await chai.request(app)
        .get(`${URL_PREFIX}/bookings`)
        .set('token', loginUser2.body.data.token);

      res.should.have.status(200);
      res.body.should.property('status').eql('success');
    });

    it('should return 400 if user booking is empty', async () => {
      const res = await chai.request(app)
        .get(`${URL_PREFIX}/bookings`)
        .set('token', loginUser.body.data.token);

      res.should.have.status(400);
      res.body.should.property('status').eql('error');
      res.body.error.should.equal('You\'ve not book any accommodation');
    });
  });
});
