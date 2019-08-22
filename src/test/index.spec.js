import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
chai.should();

describe('API ROUTES', () => {
  it('should get all entry points', async () => {
    const res = await chai.request(app)
      .get('/');

    res.should.have.status(200);
  });

  it('should return a not found error message when an invalid route is accessed', async () => {
    const res = await chai.request(app)
      .get('/fakepath');

    res.should.have.status(404);
  });
});
