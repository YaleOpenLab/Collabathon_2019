import express from 'express';
import bodyParser from 'body-parser';
import { apiRouter } from './router/index';
import { connectDb } from './config/database';

require('dotenv').config();

const app = express();

const server = require('http').createServer(app);

server.listen(process.env.port || process.env.PORT_DEV_SERVER, () => console.log(`Server running on port ${process.env.port || process.env.PORT_DEV_SERVER}`));

connectDb();
app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, authorization');
    res.header('Access-Control-Allow-Credentials', true);
    next();
  });

app.use('/api', apiRouter);
