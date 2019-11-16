import { Router } from 'express';
import reportController from '../controllers/reportController';

export const dataRouter = Router();

//no data
dataRouter.post('/', async (req, res) => reportController.getAllData(req, res));

//data: id, year
dataRouter.post('/getYearDataWithId', async (req, res) => reportController.getDataWithIdYear(req, res));

//data: contry, year
dataRouter.post('/getYearDataWithCountry', async (req, res) => reportController.getDataYearWithCountry(req, res));

//data: year
dataRouter.post('/getDataWithYear', async (req, res) => reportController.getDataWithYear(req, res));

//data: gas
dataRouter.post('/getDataWithGas', async (req, res) => reportController.getDataWithGas(req, res));

//data: sector
dataRouter.post('/getDataWithSector', async (req, res) => reportController.getDataWithSector(req, res));

//data: unit
dataRouter.post('/getDataWithUnit', async (req, res) => reportController.getDataWithUnit(req, res));

//data: unit, sector country
//dataOptional: year, gas
dataRouter.post('/getDataFilter', async (req, res) => reportController.getDataFilter(req, res));

dataRouter.post('/getPrevision', async (req, res) => reportController.getPrevision(req, res));
