import { Router } from 'express';
import reportController from '../controllers/reportController';

export const dataRouter = Router();

dataRouter.post('/', async (req, res) => reportController.getContry(req, res));
dataRouter.post('/getWithYear', async (req, res) => reportController.getDataWithYear(req, res));

