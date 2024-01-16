require("dotenv").config();
const https = require("https");
const fs = require("fs");
const path = require("path");
const createServer = require("./server");

const PORT = process.env.PORT || 3500;

const certOptions = {
  key: fs.readFileSync(path.resolve("cert/localhost-key.pem")),
  cert: fs.readFileSync(path.resolve("cert/localhost.pem")),
};

const server = createServer();

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  https.createServer(certOptions, server).listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  // Handle MongoDB connection error
});

module.exports = { server };
