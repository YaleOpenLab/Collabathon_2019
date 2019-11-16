import axios from 'axios'
import { Report } from '../models/reportModel'
import { connectDb } from '../config/database'

const serialize = async () => {
  try {
    const res = await axios.get(`https://www.climatewatchdata.org/api/v1/data/historical_emissions`);
    await Report.collection.insertMany(res.data.data);
    console.log(`Successfully add ${res.data.data.length} elements`);
  } catch (e) {
    console.log(e);
  }
}

connectDb();
serialize();