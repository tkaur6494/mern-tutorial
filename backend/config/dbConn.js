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

module.exports = connectDB;
