const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "../.env") });
let host;
if (process.env.ENV === "DEV") {
  host = "0.0.0.0";
} else {
  host = process.env.SERVER_IP;
}
module.exports = {
  env: "production",
  host: host,
  port: process.env.PORT,
  email: {
    host: process.env.EMAIL_HOST,
    admin: process.env.EMAIL_ADMIN,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
  },
  mongoose: {
    url: process.env.MONGO_URL,
    cluster: process.env.MONGO_CLUSTER_URL,
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
