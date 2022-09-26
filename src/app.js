const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes/index.js");
const { HOST } = process.env;

require("./db.js");

const server = express();

console.log("Entrando al app 1");
server.name = "API";

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
console.log("Entrando al app 2");
server.use(bodyParser.json({ limit: "50mb" }));
console.log("Entrando al app 3");
server.use(cookieParser());
console.log("Entrando al app 4");
server.use(morgan("dev"));
console.log("Entrando al app 5");

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", HOST); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

server.use("/", routes);
console.log("Entrando al app 6");

// Error catching endware.
server.use((err, req, res, next) => {
  console.log("Entrando al app 7");
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
