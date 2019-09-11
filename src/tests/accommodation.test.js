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
let centre;
let noAccommodation;

describe('/api/v1/accommodation', () => {
  const filePath = `${__dirname}/testData/house.png`;
  const filePath2 = `${__dirname}/testData/badimage.txt`;

  after(async () => {
    await TestHelper.destroyModel('Role');
    await TestHelper.destroyModel('Room');
    await TestHelper.destroyModel('Accommodation');
    await TestHelper.destroyModel('Request');
    await TestHelper.destroyModel('User');
  });

  before(async () => {
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
    it('should return 400 if relevant details is not provieded', async () => {
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
});
