const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "../.env") });
let host, domain;
if (process.env.ENV === "DEV") {
  host = "0.0.0.0";
  domain = `http://localhost:${process.env.PORT}`;
} else {
  host = process.env.SERVER_IP;
  domain = process.env.SERVER_DOMAIN;
}
module.exports = {
  env: "production",
  host: host,
  domain: domain,
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
  refressToken: {
    secret: process.env.REFRESS_SEC,
    accessExpire: process.env.REFRESS_EXPR,
  },
};
