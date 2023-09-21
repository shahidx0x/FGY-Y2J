const colors = require("colors");
const logger = require("../configs/logger");
const serverLog = (req, res, next) => {
  logger.info(`${req.method}`.green + `${req.url}`.cyan);
  next();
};
module.exports = serverLog;
