import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import db from '../models';
import TestHelper from '../utils/testHelper';
import {
  user1, user2, user3, commentBody, oneWayTrip, oneWayTrip2, userDepartments, departments
} from './testData/sampleData';

chai.use(chaiHttp);

let authToken;
let imposterToken;
let imposterToken2;
let commentId;
let requestId;
let badRequestId;
const URL_PREFIX = '/api/v1/requests';

describe('api/v1/requests/:requestId/comments', () => {
  before(async () => {
    await TestHelper.destroyModel('Request');
    await TestHelper.destroyModel('User');
    await TestHelper.destroyModel('Comment');
    await TestHelper.destroyModel('Department');
    await TestHelper.destroyModel('UserDepartment');

    const { token } = await TestHelper.createUser({
      ...user1, isVerified: true
    });
    const { token: token1 } = await TestHelper.createUser({
      ...user2, isVerified: true
    });
    const { token: token2 } = await TestHelper.createUser({
      ...user3, isVerified: true
    });
    const { body: { data: { id } } } = await chai.request(app)
      .post(`${URL_PREFIX}/one-way`)
      .set('token', token)
      .send(oneWayTrip);
    const { body: { data: { id: second } } } = await chai.request(app)
      .post(`${URL_PREFIX}/one-way`)
      .set('token', token)
      .send(oneWayTrip2);

    await db.Department.bulkCreate(departments);
    await db.UserDepartment.bulkCreate(userDepartments);

    authToken = token;
    imposterToken = token1;
    imposterToken2 = token2;
    requestId = id;
    badRequestId = second;
  });

  it('should return an error when there are no comments', async () => {
    const { body: { error }, status } = await chai.request(app)
      .get(`${URL_PREFIX}/${requestId}/comments`)
      .set('token', authToken)
      .send();

    expect(status).to.equal(400);
    expect(error).to.equal('The are no comments on this request');
  });

  it('should create a comment with valid data', async () => {
    const { body: { data: { comment, id } }, status } = await chai.request(app)
      .post(`${URL_PREFIX}/${requestId}/comments`)
      .set('token', authToken)
      .send(commentBody);

    commentId = id;
    expect(status).to.equal(201);
    expect(comment).to.equal('this is a comment');
  });

  it('should return an error when a non manager or user tries to comment', async () => {
    const { body: { error }, status } = await chai.request(app)
      .post(`${URL_PREFIX}/${requestId}/comments`)
      .set('token', imposterToken2)
      .send(commentBody);

    expect(status).to.equal(400);
    expect(error).to.equal('You cannot comment on this request');
  });

  it('should return an error if request does not exist', async () => {
    const { body: { error }, status } = await chai.request(app)
      .post(`${URL_PREFIX}/10000/comments`)
      .set('token', authToken)
      .send(commentBody);

    expect(status).to.equal(400);
    expect(error).to.equal('Request does not exist');
  });

  it('should return an error  with invalid data', async () => {
    const { body: { error: [first] }, status } = await chai.request(app)
      .post(`${URL_PREFIX}/${requestId}/comments`)
      .set('token', authToken)
      .send('commentBody');

    expect(status).to.equal(400);
    expect(first).to.equal('Comment is required');
  });

  it('should return an error message for invalid request id', async () => {
    const { body: { error }, status } = await chai.request(app)
      .post(`${URL_PREFIX}/requestId/comments`)
      .set('token', authToken)
      .send(commentBody);

    expect(status).to.equal(400);
    expect(error).to.equal('invalid input syntax for integer: "requestId"');
  });

  it('should return an error when a non manager or user tries to view comment', async () => {
    const { body: { error }, status } = await chai.request(app)
      .get(`${URL_PREFIX}/${requestId}/comments`)
      .set('token', imposterToken2)
      .send();

    expect(status).to.equal(400);
    expect(error).to.equal('You cannot see these comments');
  });

  it('should get requests comments', async () => {
    const { body: { data: [first] }, status } = await chai.request(app)
      .get(`${URL_PREFIX}/${requestId}/comments`)
      .set('token', authToken)
      .send();
    const { comment } = first;

    expect(status).to.equal(200);
    expect(comment).to.equal('this is a comment');
  });

  it('should return an error message if request does not exist', async () => {
    const { body: { error }, status } = await chai.request(app)
      .get(`${URL_PREFIX}/1000/comments`)
      .set('token', authToken)
      .send();

    expect(status).to.equal(400);
    expect(error).to.equal('Request does not exist');
  });

  it('should throw an error for invalid request id', async () => {
    const { body: { error }, status } = await chai.request(app)
      .get(`${URL_PREFIX}/requestId/comments`)
      .set('token', authToken)
      .send();

    expect(status).to.equal(400);
    expect(error).to.equal('invalid input syntax for integer: "requestId"');
  });

  it('should update the deleted field', async () => {
    const { body: { data }, status } = await chai.request(app)
      .delete(`${URL_PREFIX}/${requestId}/comments/${commentId}`)
      .set('token', authToken)
      .send();

    expect(status).to.equal(200);
    expect(data).to.equal('Comment deleted');
  });

  it('should throw an error for an incorrect request id', async () => {
    const { body: { error }, status } = await chai.request(app)
      .delete(`${URL_PREFIX}/${badRequestId}/comments/${commentId}`)
      .set('token', authToken)
      .send();

    expect(status).to.equal(400);
    expect(error).to.equal('Incorrect request id');
  });

  it('should throw an error for wrong', async () => {
    const { body: { error }, status } = await chai.request(app)
      .delete(`${URL_PREFIX}/${requestId}/comments/${commentId}`)
      .set('token', imposterToken)
      .send();

    expect(status).to.equal(400);
    expect(error).to.equal('This Comment is not yours');
  });

  it('should return an error when attempting to delete with an invalid comment id', async () => {
    const { body: { error }, status } = await chai.request(app)
      .delete(`${URL_PREFIX}/${requestId}/comments/commentId`)
      .set('token', authToken)
      .send();

    expect(status).to.equal(400);
    expect(error).to.equal('invalid input syntax for integer: "commentId"');
  });

  it('should return an error when attempting to delete a comment with the wrong id', async () => {
    const { body: { error }, status } = await chai.request(app)
      .delete(`${URL_PREFIX}/10000/comments/${commentId}`)
      .set('token', authToken)
      .send();

    expect(status).to.equal(400);
    expect(error).to.equal('Request does not exist');
  });

  it('should return an error when attempting to delete comment that does not exist', async () => {
    const { body: { error }, status } = await chai.request(app)
      .delete(`${URL_PREFIX}/${requestId}/comments/666`)
      .set('token', authToken)
      .send();

    expect(status).to.equal(400);
    expect(error).to.equal('Comment does not exist');
  });
});
