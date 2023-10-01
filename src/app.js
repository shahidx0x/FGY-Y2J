const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cors = require("cors");
const serverLog = require("../middleware/serverLog");
const auth_router = require("./auths/auth.routes");
const products_router = require("./products/products.routes");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "auths")));
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "auths"));

// set security HTTP headers
app.use(helmet());

console.log(path.join(__dirname, "auths/"));

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

//terminal log
app.use(serverLog);

// limit repeated failed requests to auth endpoints
app.use(auth_router);
app.use(products_router);

module.exports = app;
