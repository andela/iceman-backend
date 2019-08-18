import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
chai.should();

describe('API ROUTES', () => {
  it('should get entry point', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
      });
    done();
  });
});
