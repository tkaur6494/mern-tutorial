const mongoose = require("mongoose");
const config = require("../config");

const environment = process.env.NODE_ENV || "development";

const connectDB = async () => {
  try {
    await mongoose.connect(config[environment].dbURL);
  } catch (err) {
    console.log(err);
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  console.log("MongoDB Disconnected");
};

module.exports = { connectDB, disconnectDB };
