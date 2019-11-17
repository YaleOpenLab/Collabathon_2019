import axios from 'axios'
import { Report } from '../models/reportModel'
import { connectDb } from '../config/database'

const serialize = async () => {
  let page = 1;
  while (1) {
    try {
      const res = await axios.get(`https://www.climatewatchdata.org/api/v1/data/historical_emissions?page=${page}`);
      if (res.data.data.length === 0) {
        const added = page * 50;
        console.log(`Successfully add ${added} elements`);
        return ;
      }
      await Report.collection.insertMany(res.data.data);
      page++;
    } catch (e) {
      console.log(e);
    }
  }
}

connectDb();
serialize();