const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_URL);
    console.log(`database connected..${mongoose.connection.port}`);
  } catch(err) {
    console.log(err);
  }
}

module.exports = dbConnect;