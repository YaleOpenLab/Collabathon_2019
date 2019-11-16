import { Router } from 'express';
import regionController from '../controllers/reportController';

export const dataRouter = Router();

dataRouter.post('/', async (req, res) => regionController.register(req, res));
