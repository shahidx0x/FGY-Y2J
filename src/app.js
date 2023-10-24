const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cors = require("cors");
const serverLog = require("../middleware/serverLog");
const auth_router = require("./auths/auth.routes");
const category_router = require("./main/categories/categories.router");
const subcat_router = require("./main/categories/subcategories/subcategories.router");
const brands_router = require("./main/brands/brands.router");
const serverMaintain = require("../middleware/serverMaintain");
const multer_router = require("./multer/multer.router");
const products_router = require("./main/products/products.router");
const app = express();
const corsOptions = {
  origin: "https://app.gobd.xyz",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors());
app.use("/uploads", express.static("uploads"));
app.use("/", multer_router);
app.use(serverMaintain);
app.set("trust proxy", 1);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xss());
app.use(mongoSanitize());
app.use(compression());
app.use(serverLog);
app.use(auth_router);
app.use(brands_router);
app.use(category_router);
app.use(subcat_router);
app.use(products_router);

module.exports = app;
