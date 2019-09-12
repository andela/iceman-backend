import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import errorhandler from 'errorhandler';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import 'dotenv/config';
import router from './routes';
import './config/passport';
import './config/cloudinary';

const swaggerDocument = YAML.load(`${process.cwd()}/src/docs/docs.yaml`);
const isProduction = process.env.NODE_ENV === 'production';
// Create global app object
const app = express();

app.use(cors());

// Normal express config defaults
app.use(require('morgan')('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('method-override')());

if (!isProduction) {
  app.use(errorhandler());
}
// versioning api
app.use('/api/v1', router);

app.get('/', (req, res) => res.status(200).send('Welcome to Barefoot Nomad'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// global error handler
app.use((err, req, res, next) => {
  res.status(err.status).send(err.message);
  next();
});

export default app;
