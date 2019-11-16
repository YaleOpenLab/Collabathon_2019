import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    contry: String,
    dataSource: String,
    sector: String,
    gas: String,
    unit: String,
    years: {
        year: Number,
        data: Number
    }
})

export const Report = mongoose.model("Report", ReportSchema);