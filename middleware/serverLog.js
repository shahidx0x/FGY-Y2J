const colors = require("colors");
const logger = require("../configs/logger");
const serverLog = (req, res, next) => {
  console.log(req.headers);
  let requestMethod;
  if (req.method === "GET") requestMethod = `${req.method}`.bgGreen;
  else if (req.method === "DELET") requestMethod = `${req.method}`.bgRed;
  else if (req.method === "POST") requestMethod = `${req.method}`.bgCyan;
  else if (req.method === "PATCH") requestMethod = `${req.method}`.bgMagenta;
  logger.info(
    `${req.rawHeaders[3]}`.green +
      " " +
      requestMethod +
      " " +
      "==>".magenta +
      " " +
      `${req.url}`.cyan
  );
  next();
};
module.exports = serverLog;
