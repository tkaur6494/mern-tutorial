require("dotenv").config();

module.exports = {
  development: {
    dbURL: process.env.DEV_DATABASE_URI,
  },
  test: {
    dbURL: process.env.TEST_DATABASE_URI,
  },
};
