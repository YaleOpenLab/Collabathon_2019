import axios from 'axios'
import { Report } from '../models/reportModel'
import { connectDb } from '../config/database'

const serialize = async () => {
  let page = 1;
  while (1) {
    try {
      const res = await axios.get(`https://data.emissionspathways.org/api/v1/data/emission_pathways?page=${page}`);
      if (res.data.data.length === 0) {
        console.log(`Successfully add ${res.data.data.length} elements`);
        return ;
      }
      var arrLen = res.data.data.length
      for(var i = 0; i < arrLen; i++)
      {
        if (!"Global Change Assessment Model".localeCompare(res.data.data[i].model))
        {
          //console.log(res.data.data[i])
          await Report.collection.insertOne(res.data.data[i]);
        }
      }
      page++;
    } catch (e) {
      console.log(e);
    }
  }
}

connectDb();
serialize();