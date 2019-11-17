import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const FutureSchema = new Schema({
    id: Number,
    location: String,
    iso_code2: String,
    model: String,
    scenario: String,
    category: String,
    subcategory: String,
    indicator: String,
    composite_name: String,
    unit: String,
    definition: String,
    emissions: Array({
        year: Number,
        value: Number
    })
})

export const Future = mongoose.model("Future", FutureSchema);