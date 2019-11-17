import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    id: Number,
    iso_code3: String,
    country: String,
    data_source: String,
    sector: String,
    gas: String,
    unit: String,
    emissions: Array({
        year: Number,
        value: Number
    })
})

export const Report = mongoose.model("Report", ReportSchema);