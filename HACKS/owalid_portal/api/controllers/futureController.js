import { Future } from '../models/futureModel';
import mongoose from 'mongoose';

const getAllDataFuture = async (req, res) => {
    try {
        const country = await Future.find();
        res.status(200).json({ success: true, country: country });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error })
    }
}

const getDataFutureWithLocation = async (req, res) => {
    try {
        const { location } = req.body;
        const data = await Future.find({ location: location })
        res.status(200).json({ sucess: true, data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}
const getDataFutureWithScenario = async (req, res) => {
    try {
        const { scenario } = req.body;
        const data = await Future.find({ scenario: scenario })
        res.status(200).json({ sucess: true, data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}
const getDataFutureWithIndicator = async (req, res) => {
    try {
        const { indicator } = req.body;
        const data = await Future.find({ indicator: indicator })
        res.status(200).json({ sucess: true, data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}

const getDataFutureWithUnit = async (req, res) => {
    try {
        const { unit } = req.body;
        const data = await Future.find({ unit: unit })
        res.status(200).json({ sucess: true, data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}


export default {
    getAllDataFuture,
    getDataFutureWithLocation,
    getDataFutureWithScenario,
    getDataFutureWithIndicator,
    getDataFutureWithUnit
}