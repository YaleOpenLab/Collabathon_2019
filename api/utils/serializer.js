import fs from 'fs';
import csv from 'fast-csv'

fs.createReadStream('ghg-emissions.csv').pipe(
  csv.parse({ headers: true }
)).on('data', row => console.log(row))