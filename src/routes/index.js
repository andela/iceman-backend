import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import authRoute from './auth';
import api from './api';

const router = Router();

const swaggerDocument = YAML.load(`${process.cwd()}/src/docs/docs.yaml`);

router.get('/', (req, res) => res.status(200).send('Welcome to Barefoot Normad'));
router.use('/api/v1/auth', authRoute);
router.use('/api', api);

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


export default router;
