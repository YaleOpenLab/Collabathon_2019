import axios from 'axios'
import { Future } from '../models/futureModel'
import { connectDb } from '../config/database'

const serialize = async () => {
  let page = 1;
  while (1) {
    try {
      const res = await axios.get(`https://data.emissionspathways.org/api/v1/data/emission_pathways?page=${page}`);
      if (res.data.data.length === 0) {
        const added = page * 50;
        console.log(`Successfully add ${added} elements`);
        return ;
      }
      await Future.collection.insertMany(res.data.data);
      page++;
    } catch (e) {
      console.log(e);
    }
  }
}

connectDb();
serialize();