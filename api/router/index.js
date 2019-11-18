import { Router } from 'express'
import { dataRouter } from './dataRouter';

export const apiRouter = Router();

apiRouter.use('/data', dataRouter);
