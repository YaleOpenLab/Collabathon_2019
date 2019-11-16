import { Router } from 'express';
import reportController from '../controllers/reportController';

export const dataRouter = Router();

dataRouter.post('/', async (req, res) => reportController.getAllData(req, res));
dataRouter.post('/getYearDataWithId', async (req, res) => reportController.getDataWithIdYear(req, res));
dataRouter.post('/getYearDataWithCountry', async (req, res) => reportController.getDataYearWithCountry(req, res));
dataRouter.post('/getDataWithYear', async (req, res) => reportController.getDataWithYear(req, res));
dataRouter.post('/getDataWithGas', async (req, res) => reportController.getDataWithGas(req, res));
dataRouter.post('/getDataWithSector', async (req, res) => reportController.getDataWithSector(req, res));
dataRouter.post('/getDataWithUnit', async (req, res) => reportController.getDataWithUnit(req, res));
dataRouter.post('/getDataFilter', async (req, res) => reportController.getDataFilter(req, res));
dataRouter.post('/getPrevision', async (req, res) => reportController.getPrevision(req, res));

