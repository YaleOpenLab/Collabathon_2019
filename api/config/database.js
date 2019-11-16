import mongoose from 'mongoose';

require('dotenv').config();
export const connectDb = async () => {
  try {
    console.log('Starting server');
    mongoose.set('useFindAndModify', false);
    await mongoose.connect(`mongodb://heroku_m24wl5c1:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connect to db');
  } catch (err) {
    console.log(`Failed to connect to MongoDB server: \n${err}`);
  }
}
