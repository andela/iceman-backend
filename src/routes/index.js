import express from 'express';

const app = express.Router();


app.get('/', (req, res) => res.status(200).send('Welcome to Barefoot Normad'));

export default app;
