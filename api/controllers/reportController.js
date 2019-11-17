import { Report } from '../models/reportModel';
import mongoose from 'mongoose';

const mostPollutingSector = async (req, res) => {
    try {
        const sectors = await Report.distinct("sector");
        let result = [];
        let emissions;
        for (let i = 0; i < sectors.length; i++) {
            const countries = await Report.find({ sector: sectors[i] });
            emissions = {};
            for (let j = 0; j < countries.length; j++) {
                countries[j].emissions.map(v => {
                    if (!emissions[v.year]) {
                        emissions[v.year] = v.value ? v.value : 0;
                    } else {
                        emissions[v.year] += v.value ? v.value : 0;
                    }
                });
            }
            result.push({
                emissions,
                sector: sectors[i]
            })
        }
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error })
    }
}

const getAllData = async (req, res) => {
    try {
        const country = await Report.find();
        res.status(200).json({ success: true, country: country });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error })
    }
}


const getDataContryCo2 = async (req, res) => {
    try {
        const country = await Report.find({ gas: 'CO2' },  { emissions: { $max: { year } }});
        // const currentYear = 2014;
        // let result = {};
        // country.map(k => {
        //     if (!result[k.country]) {
        //         result[k.country] = {};
        //             k.emissions.map(v => {
        //                 if (v.year == currentYear) {                            
        //                         result[k.country][currentYear] = v.value ? v.value : 0;
        //                 }
        //             })
        //     } else {
        //         k.emissions.map(v => {
        //             if (v.year == currentYear) {
        //                 result[k.country][currentYear] += v.value ? v.value : 0;
        //             }
        //         })
        //     }
        // })
        res.status(200).json({ success: true, country: country });
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

const getDataWithCountry = async (req, res) => {
    try {
        const { country } = req.body;
        const data = await Report.find({ country: country });
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
        console.log(sector, country, unit);
        let data;
        if (year && gas) {
            data = await Report.find({ unit: unit, gas: gas, sector: sector, country: country }, { emissions: { $elemMatch: { year: year } } })
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

export default {
    getAllData,
    getDataYearWithCountry,
    getDataWithIdYear,
    getDataWithYear,
    getDataWithGas,
    getDataWithSector,
    getDataWithUnit,
    getDataFilter,
    getDataWithCountry,
    getDataContryCo2,
    mostPollutingSector
}