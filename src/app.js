const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cors = require("cors");
const serverLog = require("../middleware/serverLog");
const auth_router = require("./auths/auth.routes");
const path = require("path");
const category_router = require("./products/categories/categories.router");
const subcat_router = require("./products/categories/subcategories/subcategories.router");
const brands_router = require("./products/brands/brands.router");

const app = express();
// app.use(express.static(path.join(__dirname, "auths")));
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "auths"));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xss());
app.use(mongoSanitize());
app.use(compression());
app.use(cors());
app.options("*", cors());
app.use(serverLog);
app.use(auth_router);
app.use(brands_router);
app.use(category_router);
app.use(subcat_router);

module.exports = app;
