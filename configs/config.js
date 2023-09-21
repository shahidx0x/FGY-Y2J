const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "../.env") });

module.exports = {
  env: "production",
  port: process.env.PORT,
  mongoose: {
    url: process.env.MONGO_URL,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: process.env.JWT_SEC,
    accessExpire: process.env.JWT_EXPR,
  },
};
