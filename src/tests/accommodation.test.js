import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import TestHelper from '../utils/testHelper';
import Helper from '../utils/helpers';
import { user } from './testData/sampleData';
import db from '../models';
import insertRoles from '../utils/insertTestRoles';

chai.use(chaiHttp);
chai.should();

const URL_PREFIX = '/api/v1/accommodation';
let loginUser;
let loginUser2;
let accommodation;
let accommodation2;
let room;
let noAccommodation;

describe('/api/v1/accommodation', () => {
  const filePath = `${__dirname}/testData/house.png`;
  const filePath2 = `${__dirname}/testData/badimage.txt`;

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

    noAccommodation = await chai.request(app)
      .get(`${URL_PREFIX}`)
      .set('token', loginUser.body.data.token);


    accommodation = await chai.request(app)
      .post(`${URL_PREFIX}`)
      .set('token', loginUser.body.data.token)
      .field('name', 'Royal Guest House')
      .field('country', 'Nigeria')
      .field('state', 'Ibadan')
      .field('city', 'Ojoo')
      .field('address', '20 agodi oojoo')
      .field('description', 'Nice one')
      .attach('image', filePath);

    accommodation2 = await chai.request(app)
      .post(`${URL_PREFIX}`)
      .set('token', loginUser.body.data.token)
      .field('name', 'King Guest House')
      .field('country', 'Nigeria')
      .field('state', 'Ibadan')
      .field('city', 'Ojoo')
      .field('address', '20 agodi oojoo')
      .field('description', 'Nice one')
      .attach('image', filePath);

    room = await chai.request(app)
      .post(`${URL_PREFIX}/${accommodation.body.data.id}/room`)
      .set('token', loginUser.body.data.token)
      .field('name', 'Room 1')
      .field('roomType', 'single')
      .field('facilities', 'ac, tv, chair')
      .attach('images', filePath);
  });

  describe('POST ', () => {
    it('should return 200 if the accommodation was added successfully', async () => {
      accommodation.should.have.status(200);
      accommodation.body.data.should.have.property('name', 'Royal Guest House');
      accommodation.body.data.should.have.property('country', 'Nigeria');
      accommodation.body.data.should.have.property('state', 'Ibadan');
      accommodation.body.data.should.have.property('address', '20 agodi oojoo');
      accommodation.body.data.should.have.property('description', 'Nice one');
      accommodation.body.data.should.have.property('image');
    });

    it('should return 400 if the accommodation already exists', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}`)
        .set('token', loginUser.body.data.token)
        .field('name', 'Royal Guest House')
        .field('country', 'Nigeria')
        .field('state', 'Ibadan')
        .field('city', 'Ojoo')
        .field('address', '20 agodi oojoo')
        .field('description', 'Nice one')
        .attach('image', filePath);

      res.should.have.status(400);
      res.body.should.have.property('error', 'This centre already exists');
    });

    it('should return 400 if no image was uploaded for the accommodation', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}`)
        .set('token', loginUser.body.data.token)
        .field('name', 'Royal Guest House')
        .field('country', 'Nigeria')
        .field('state', 'Ibadan')
        .field('city', 'Ojoo')
        .field('address', '20 agodi oojoo')
        .field('description', 'Nice one')
        .attach('image', '');

      res.should.have.status(400);
      res.body.should.have.property('error', 'Please upload a valid image');
    });
    it('should return 400 if relevant details is not provieded', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}`)
        .set('token', loginUser.body.data.token)
        .field('name', '')
        .field('country', '')
        .field('state', '')
        .field('city', '')
        .field('address', '')
        .field('description', 'Nice one')
        .attach('image', '');

      res.should.have.status(400);
      res.body.error.length.should.equal(5);
      res.body.error[0].should.equal('Please provide the name of the accommodation centre');
      res.body.error[1].should.equal('Please provide the country were the accommodation centre is located');
      res.body.error[2].should.equal('Please provide the state were the accommodation centre is located');
      res.body.error[3].should.equal('Please provide the city were the accommodation centre is located');
      res.body.error[4].should.equal('Please provide the address of the accommodation centre');
    });
  });
  describe('POST /:centreId/room', () => {
    it('should return 200 if the room was added successfully', async () => {
      room.should.have.status(200);
      room.body.data.should.have.property('name', 'Room 1');
      room.body.data.should.have.property('roomType', 'single');
      room.body.data.should.have.property('facilities');
      room.body.data.should.have.property('images');
    });

    it('should return 400 if the room already exists', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/${accommodation.body.data.id}/room`)
        .set('token', loginUser.body.data.token)
        .field('name', 'Room 1')
        .field('roomType', 'single')
        .field('facilities', 'ac, tv, chair')
        .attach('images', filePath);

      res.should.have.status(400);
      res.body.should.have.property('error', 'This room already exists');
    });

    it('should return 500 if the uploaded image is not valid', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/${accommodation.body.data.id}/room`)
        .set('token', loginUser.body.data.token)
        .field('name', 'Room 2')
        .field('roomType', 'single')
        .field('facilities', 'ac, tv, chair')
        .attach('images', filePath2);

      res.should.have.status(500);
    });

    it('should return 400 if no image was uploaded for the room', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/${accommodation.body.data.id}/room`)
        .set('token', loginUser.body.data.token)
        .field('name', 'Room 1')
        .field('roomType', 'single')
        .field('facilities', 'ac, tv, chair')
        .attach('images', '');

      res.should.have.status(400);
      res.body.should.have.property('error', 'Please upload a valid image(s)');
    });
    it('should return 400 if required fields are not provided', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/${accommodation.body.data.id}/room`)
        .set('token', loginUser.body.data.token)
        .field('name', '')
        .field('roomType', '')
        .field('facilities', '')
        .attach('images', '');

      res.should.have.status(400);
      res.body.error.length.should.equal(3);
      res.body.error[0].should.equal('Please provide the room name');
      res.body.error[1].should.equal('Please select valid room type');
      res.body.error[2].should.equal('Please specify the room facilities');
    });
  });
  describe('GET /', () => {
    it('should return 200 if there are one or more accommodation', async () => {
      const res = await chai.request(app)
        .get(`${URL_PREFIX}`)
        .set('token', loginUser.body.data.token);

      res.should.have.status(200);
    });
    it('should return 400 if there are no accommodation', async () => {
      noAccommodation.should.have.status(400);
      noAccommodation.body.should.have.property('error', 'There are no accommodation yet');
    });
  });
  describe('PATCH /', () => {
    it('should return 200 if the accommodation image and details was updated successfully', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/${accommodation2.body.data.id}`)
        .set('token', loginUser.body.data.token)
        .field('name', 'King House')
        .field('country', 'Nigeria')
        .field('state', 'Lagos')
        .field('city', 'Ikeja')
        .field('address', '20 Ikeja oojoo')
        .attach('image', filePath);

      res.should.have.status(200);
      res.body.data.should.have.property('name', 'King House');
      res.body.data.should.have.property('country', 'Nigeria');
      res.body.data.should.have.property('state', 'Lagos');
      res.body.data.should.have.property('city', 'Ikeja');
      res.body.data.should.have.property('address', '20 Ikeja oojoo');
      res.body.data.should.have.property('image');
    });
    it('should return 200 if the accommodation was updated successfully', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/${accommodation2.body.data.id}`)
        .set('token', loginUser.body.data.token)
        .field('name', 'King House')
        .field('country', 'Nigeria')
        .field('state', 'Lagos')
        .field('city', 'Ikeja')
        .field('address', '20 Ikeja oojoo');

      res.should.have.status(200);
      res.body.data.should.have.property('name', 'King House');
      res.body.data.should.have.property('country', 'Nigeria');
      res.body.data.should.have.property('state', 'Lagos');
      res.body.data.should.have.property('city', 'Ikeja');
      res.body.data.should.have.property('address', '20 Ikeja oojoo');
    });
    it('should return 400 if the user can not update that accommodation', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/${accommodation2.body.data.id}`)
        .set('token', loginUser2.body.data.token)
        .field('name', 'King House')
        .field('country', 'Nigeria')
        .field('state', 'Lagos')
        .field('city', 'Ikeja')
        .field('address', '20 Ikeja oojoo');

      res.should.have.status(400);
      res.body.should.have.property('error', 'You cannot edit this accommodation');
    });
  });
  describe('DELETE /:id', () => {
    it('should return 400 if the user can not delete the accommodation', async () => {
      const res = await chai.request(app)
        .delete(`${URL_PREFIX}/${accommodation2.body.data.id}`)
        .set('token', loginUser2.body.data.token);

      res.should.have.status(400);
      res.body.should.have.property('error', 'You cannot delete this accommodation');
    });
    it('should return 200 if the accommodation centre was deleted successfully', async () => {
      const res = await chai.request(app)
        .delete(`${URL_PREFIX}/${accommodation2.body.data.id}`)
        .set('token', loginUser.body.data.token);

      res.should.have.status(200);
      res.body.should.have.property('message', 'The accommodation has been deleted successfully');
    });
  });
  describe('PATCH /:id/room', () => {
    it('should return 200 if the room was updated successfully', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/${room.body.data.id}/room`)
        .set('token', loginUser.body.data.token)
        .field('name', 'Room 2')
        .field('roomType', 'double')
        .field('facilities', 'ac, tv, chair')
        .attach('images', filePath);

      res.should.have.status(200);
      res.body.data.should.have.property('name', 'Room 2');
      res.body.data.should.have.property('roomType', 'double');
      res.body.data.should.have.property('facilities');
      res.body.data.should.have.property('images');
    });
    it('should return 200 if the room image(s) was updated successfully', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/${room.body.data.id}/room`)
        .set('token', loginUser.body.data.token)
        .field('name', 'Room 3')
        .field('roomType', 'single')
        .field('facilities', 'ac, tv, chair');

      res.should.have.status(200);
      res.body.data.should.have.property('name', 'Room 3');
      res.body.data.should.have.property('roomType', 'single');
      res.body.data.should.have.property('facilities');
      res.body.data.should.have.property('images');
    });
    it('should return 400 if the room does not exist', async () => {
      const res = await chai.request(app)
        .patch(`${URL_PREFIX}/1000/room`)
        .set('token', loginUser.body.data.token)
        .field('name', 'Room 3')
        .field('roomType', 'single')
        .field('facilities', 'ac, tv, chair');

      res.should.have.status(400);
      res.body.should.have.property('error', 'The room does not exists');
    });
  });
  describe('DELETE /:id/room', () => {
    it('should return 400 if the operation to delete a room was not successful', async () => {
      const res = await chai.request(app)
        .delete(`${URL_PREFIX}/10000/room`)
        .set('token', loginUser.body.data.token);

      res.should.have.status(400);
      res.body.should.have.property('error', 'The operation was not successfully');
    });
    it('should return 200 if the room was deleted successfully', async () => {
      const res = await chai.request(app)
        .delete(`${URL_PREFIX}/${room.body.data.id}/room`)
        .set('token', loginUser.body.data.token);

      res.should.have.status(200);
      res.body.should.have.property('message', 'The room has been deleted successfully');
    });
  });
});
