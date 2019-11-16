import { Report } from '../models/reportModel';
import mongoose from 'mongoose';

const getAllData = async (req, res) => {
    try {
        const contry = await Report.find();
        res.status(200).json({ success: true, contry: contry });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error })
    }
}

const getDataYearWithCountry = async (req, res) => {
    try {
        const { country, year } = req.body;
        const data = await Report.find({ country: country }, { emissions: { $elemMatch: { year: year } } })
        res.status(200).json({ sucess: true, data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}

const getDataWithIdYear = async (req, res) => {
    try {
        const { id, year } = req.body;
        const data = await Report.find({ _id: mongoose.Types.ObjectId(id) }, { emissions: { $elemMatch: { year: year } } })
        res.status(200).json({ sucess: true, data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}

const getDataWithYear = async (req, res) => {
    try {
        const { year } = req.body;
        const data = await Report.find({}, { emissions: { $elemMatch: { year: year } } })
        res.status(200).json({ sucess: true, data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}

const getDataWithGas = async (req, res) => {
    try {
        const { gas } = req.body;
        const data = await Report.find({ gas: gas });
        res.status(200).json({ sucess: true, data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}

const getDataWithSector = async (req, res) => {
    try {
        const { sector } = req.body;
        const data = await Report.find({ sector: sector });
        res.status(200).json({ sucess: true, data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}

const getDataWithUnit = async (req, res) => {
    try {
        const { unit } = req.body;
        const data = await Report.find({ unit: unit });
        res.status(200).json({ sucess: true, data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}

const getDataFilter = async (req, res) => {
    try {
        const { unit, sector, gas, year, country } = req.body;
        let data;
        if (year && gas) {
            data = await Report.find({ unit: unit, gas: gas, sector: sector, country: country },{ emissions: { $elemMatch: { year: year } } })
        } else if (!year && gas) {
            data = await Report.find({ unit: unit, gas: gas, sector: sector, country: country })
        } else if (year && !gas) {
            data = await Report.find({ unit: unit, sector: sector, year: year, country: country })
        } else {
            data = await Report.find({ unit: unit, sector: sector, country: country })
        }
        res.status(200).json({ sucess: true, data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}

const getPrevision = async (req, res) => {
    
}

export default {
    getAllData,
    getDataYearWithCountry,
    getDataWithIdYear,
    getDataWithYear,
    getDataWithGas,
    getDataWithSector,
    getDataWithUnit,
    getDataFilter,
    getPrevision
}