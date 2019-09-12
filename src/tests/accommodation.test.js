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
let loginUser, loginUser2;
let centre;
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
      ...user, email: 'user2@gmail.com', roleId: 5
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


    centre = await chai.request(app)
      .post(`${URL_PREFIX}`)
      .set('token', loginUser.body.data.token)
      .field('name', 'Royal Guest House')
      .field('country', 'Nigeria')
      .field('state', 'Ibadan')
      .field('city', 'Ojoo')
      .field('address', '20 agodi oojoo')
      .field('description', 'Nice one')
      .attach('image', filePath);
  });

  describe('POST /', () => {
    it('should return 200 if the centre was added successfully', async () => {
      centre.should.have.status(200);
      centre.body.data.should.have.property('name', 'Royal Guest House');
      centre.body.data.should.have.property('country', 'Nigeria');
      centre.body.data.should.have.property('state', 'Ibadan');
      centre.body.data.should.have.property('address', '20 agodi oojoo');
      centre.body.data.should.have.property('description', 'Nice one');
      centre.body.data.should.have.property('image');
    });

    it('should return 400 if the centre already exists', async () => {
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

    it('should return 400 if no image was uploaded for the centre', async () => {
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
    });
  });

  describe('POST /:centreId/room', () => {
    it('should return 200 if the room was added successfully', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/${centre.body.data.id}/room`)
        .set('token', loginUser.body.data.token)
        .field('name', 'Room 1')
        .field('roomType', 'single')
        .field('facilities', 'ac, tv, chair')
        .attach('images', filePath);

      res.should.have.status(200);
      res.body.data.should.have.property('name', 'Room 1');
      res.body.data.should.have.property('roomType', 'single');
      res.body.data.should.have.property('facilities');
      res.body.data.should.have.property('images');
    });

    it('should return 400 if the room already exists', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/${centre.body.data.id}/room`)
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
        .post(`${URL_PREFIX}/${centre.body.data.id}/room`)
        .set('token', loginUser.body.data.token)
        .field('name', 'Room 2')
        .field('roomType', 'single')
        .field('facilities', 'ac, tv, chair')
        .attach('images', filePath2);

      res.should.have.status(500);
    });

    it('should return 400 if no image was uploaded for the room', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/${centre.body.data.id}/room`)
        .set('token', loginUser.body.data.token)
        .field('name', 'Room 1')
        .field('roomType', 'single')
        .field('facilities', 'ac, tv, chair')
        .attach('images', '');

      res.should.have.status(400);
      res.body.should.have.property('error', 'Please upload a valid image(s)');
    });

    it('should return 400 if relevant details are not provided', async () => {
      const res = await chai.request(app)
        .post(`${URL_PREFIX}/${centre.body.data.id}/room`)
        .set('token', loginUser.body.data.token)
        .field('name', '')
        .field('roomType', '')
        .field('facilities', '')
        .attach('images', '');

      res.should.have.status(400);
    });
  });

  describe('GET /', () => {
    it('should return 200 if there are one or more accommodation', async () => {
      const res = await chai.request(app)
        .get(`${URL_PREFIX}`)
        .set('token', loginUser.body.data.token);

      res.should.have.status(200);
    });

    it('should return 404 if there are no accommodation', async () => {
      noAccommodation.should.have.status(400);
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
