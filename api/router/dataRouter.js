import { Router } from 'express';
import reportController from '../controllers/reportController';
import futureController from '../controllers/futureController';

export const dataRouter = Router();

//no data
dataRouter.post('/', async (req, res) => await reportController.getAllData(req, res));

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

//data: country
dataRouter.post('/getDataWithCountry', async (req, res) => reportController.getDataWithCountry(req, res));

//data: unit, sector country
//dataOptional: year, gas
dataRouter.post('/getDataFilter', async (req, res) => reportController.getDataFilter(req, res));

dataRouter.post('/getDataContryCo2', async (req, res) => reportController.getDataContryCo2(req, res));

dataRouter.get('/mostPollutingSector', async (req, res) => reportController.mostPollutingSector(req, res));


/*-----------------------------FUTURE-----------------------------*/

dataRouter.post('/future', async (req, res) => await futureController.getAllDataFuture(req, res))

//data: location
dataRouter.post('/getFutureWithLocation', async (req, res) => await futureController.getDataFutureWithLocation(req, res))

//data: scenario
dataRouter.post('/getFutureWithScenario', async (req, res) => await futureController.getDataFutureWithScenario(req, res))

//data: indicator
dataRouter.post('/getFutureWithIndicator', async (req, res) => await futureController.getDataFutureWithIndicator(req, res))

//data: unit
dataRouter.post('/getFutureWithUnit', async (req, res) => await futureController.getDataFutureWithUnit(req, res))