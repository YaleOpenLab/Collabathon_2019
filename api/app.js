import express from 'express';
import bodyParser from 'body-parser';
import { apiRouter } from './routes/index';
import { connectDb } from './config/database';

require('dotenv').config();

const app = express();

const server = require('http').createServer(app);

server.listen(process.env.port || process.env.PORT_DEV_SERVER, () => console.log(`Server running on port ${process.env.port || process.env.PORT_DEV_SERVER}`));

connectDb();
console.log(`Server in ${process.env.NODE_ENV} mode`);
app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use('/api', apiRouter);
