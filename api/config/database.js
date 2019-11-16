import mongoose from 'mongoose';

require('dotenv').config();
export const connectDb = async () => {
  try {
    color.colog('Starting server', 'green');
    mongoose.set('useFindAndModify', false);
    await mongoose.connect(`mongodb://heroku_m24wl5c1:${process.env.DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true });
    color.colog('Connect to db', 'green')
  } catch (err) {
    color.colog(`Failed to connect to MongoDB server: \n${err}`, 'red');
  }
}
