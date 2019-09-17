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

  after(async () => {
    await TestHelper.destroyModel('Feedback');
    await TestHelper.destroyModel('Like');
    await TestHelper.destroyModel('Role');
    await TestHelper.destroyModel('Room');
    await TestHelper.destroyModel('Accommodation');
    await TestHelper.destroyModel('Request');
    await TestHelper.destroyModel('User');
  });

  before(async () => {
    await TestHelper.destroyModel('Feedback');
    await TestHelper.destroyModel('Like');
    await TestHelper.destroyModel('Role');
    await TestHelper.destroyModel('Room');
    await TestHelper.destroyModel('Accommodation');
    await TestHelper.destroyModel('Request');
    await TestHelper.destroyModel('User');
    await db.Role.bulkCreate(insertRoles);

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

  describe('POST /:accommodationId/like', () => {
    it('should deny user access when not logged in', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/1/like`);

      res.should.have.status(401);
      res.body.should.be.an('object');
      res.body.error.should.equal('Access Denied, No token provided');
    });

    it('should deny access when token is invalid', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/1/like`)
        .set('token', 'invalid token');

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('Access Denied, Invalid token');
    });

    it('should fail if accommodation ID entered is not a valid integer', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/a/like`)
        .set('token', loginUser2.body.data.token);

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error[0].should.equal('Accommodation ID must be an integer greater than or equal to 1');
    });

    it('should fail if accommodation centre does not exist', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/144/like`)
        .set('token', loginUser2.body.data.token);

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('This accommodation centre does not exist');
    });

    it('should post like to accommodation centre if all conditions are met', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/1/like`)
        .set('token', loginUser2.body.data.token);

      res.should.have.status(201);
      res.body.should.be.an('object');
      res.body.data.should.have.property('userId');
      res.body.data.should.have.property('accommodationId');
    });

    it('should fail if accommodation has already been liked by user', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/1/like`)
        .set('token', loginUser2.body.data.token);

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('You\'ve already liked this centre');
    });
  });

  describe('DELETE /:accommodationId/like', () => {
    it('should deny user access when not logged in', async () => {
      const res = await chai.request(app)
        .delete(`${URL_PREFIX}/1/like`);

      res.should.have.status(401);
      res.body.should.be.an('object');
      res.body.error.should.equal('Access Denied, No token provided');
    });

    it('should deny access when token is invalid', async () => {
      const res = await chai.request(app)
        .delete(`${URL_PREFIX}/1/like`)
        .set('token', 'invalid token');

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('Access Denied, Invalid token');
    });

    it('should fail if accommodation ID entered is not a valid integer', async () => {
      const res = await chai.request(app)
        .delete(`${URL_PREFIX}/a/like`)
        .set('token', loginUser2.body.data.token);

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error[0].should.equal('Accommodation ID must be an integer greater than or equal to 1');
    });

    it('should fail if accommodation centre does not exist', async () => {
      const res = await chai.request(app)
        .delete(`${URL_PREFIX}/144/like`)
        .set('token', loginUser2.body.data.token);

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('This accommodation centre does not exist');
    });

    it('should unlike the accommodation centre if all conditions are met', async () => {
      const res = await chai.request(app)
        .delete(`${URL_PREFIX}/1/like`)
        .set('token', loginUser2.body.data.token);

      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.message.should.equal('You\'ve unliked this centre successfully');
    });

    it('should fail if the accommodation centre has already been unliked by user', async () => {
      const res = await chai.request(app)
        .delete(`${URL_PREFIX}/1/like`)
        .set('token', loginUser2.body.data.token);

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('You\'ve already unliked this centre');
    });
  });

  describe('POST /:accommodationId/feedback', () => {
    it('should deny user access when not logged in', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/1/feedback`)
        .send({ comment: 'Very nice place' });

      res.should.have.status(401);
      res.body.should.be.an('object');
      res.body.error.should.equal('Access Denied, No token provided');
    });

    it('should deny access when token is invalid', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/1/feedback`)
        .set('token', 'invalid token')
        .send({ comment: 'Very nice place' });

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('Access Denied, Invalid token');
    });

    it('should fail if accommodation ID entered is not a valid integer', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/a/feedback`)
        .set('token', loginUser2.body.data.token)
        .send({ comment: 'Very nice place' });

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error[0].should.equal('Accommodation ID must be an integer greater than or equal to 1');
    });

    it('should fail if no comment is entered in the request body', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/1/feedback`)
        .set('token', loginUser2.body.data.token);

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error[0].should.equal('Please enter your comment');
    });

    it('should fail if accommodation centre does not exist', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/144/feedback`)
        .set('token', loginUser2.body.data.token)
        .send({ comment: 'Very nice place' });

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('This accommodation centre does not exist');
    });

    it('should post feedback successfully if all conditions are met', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/1/feedback`)
        .set('token', loginUser2.body.data.token)
        .send({ comment: 'Very nice place' });

      res.should.have.status(201);
      res.body.should.be.an('object');
      res.body.data.should.have.property('id');
      res.body.data.should.have.property('userId');
      res.body.data.should.have.property('accommodationId');
      res.body.data.should.have.property('comment').eql('Very nice place');
    });
  });

  describe('DELETE /feedback/feedbackId', async () => {
    it('should deny user access when not logged in', async () => {
      const res = await chai.request(app)
        .delete(`${URL_PREFIX}/feedback/1`);

      res.should.have.status(401);
      res.body.should.be.an('object');
      res.body.error.should.equal('Access Denied, No token provided');
    });

    it('should deny access when token is invalid', async () => {
      const res = await chai.request(app)
        .delete(`${URL_PREFIX}/feedback/1`)
        .set('token', 'invalid token');

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('Access Denied, Invalid token');
    });

    it('should fail if feedback ID entered is not a valid integer', async () => {
      const res = await chai.request(app)
        .delete(`${URL_PREFIX}/feedback/a`)
        .set('token', loginUser2.body.data.token);

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error[0].should.equal('Feedback ID must be an integer greater than or equal to 1');
    });

    it('should fail if feedback does not exist', async () => {
      const res = await chai.request(app)
        .delete(`${URL_PREFIX}/feedback/144`)
        .set('token', loginUser2.body.data.token);

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('This feedback comment does not exist');
    });

    it('should fail if feedback does not belong to the user', async () => {
      const res = await chai.request(app)
        .delete(`${URL_PREFIX}/feedback/1`)
        .set('token', loginUser.body.data.token);

      res.should.have.status(400);
      res.body.should.be.an('object');
      res.body.error.should.equal('You are not allowed to delete this feedback comment');
    });

    it('should remove feedback comment successfully if all conditions are met', async () => {
      const res = await chai.request(app)
        .delete(`${URL_PREFIX}/feedback/1`)
        .set('token', loginUser2.body.data.token);

      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.message.should.equal('You\'ve removed this feedback successfully');
    });
  });
});
