import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import authRoute from './auth';

const app = Router();
app.use('/auth', authRoute);


const swaggerDocument = YAML.load(`${process.cwd()}/src/docs/docs.yaml`);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.get('/', (req, res) => res.status(200).send('Welcome to Barefoot Normad'));

export default app;
