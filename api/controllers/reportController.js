import { Report } from '../models/reportModel';
import mongoose from 'mongoose';

const getContry = async (req, res) => {
    try {
        const contry = await Report.findOne({ imdb_code: imdbcode });
        res.status(200).json({ success: true, contry: contry });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error })
    }
}

const getDataWithYear = async (req, res) => {
    try {
        const {id, year} = req.body;
        const data = await Report.findOne({_id: id}).find( { "years": { $year: year } } )
        res.status(200).json({sucess: true, data: data});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error});
    }
}


export default {
    getContry,
    getDataWithYear,
  }