const colors = require("colors");
const logger = require("../configs/logger");

const methodColors = {
  GET: "green",
  POST: "cyan",
  DELETE: "red",
  PATCH: "magenta",
};

const serverLog = (req, res, next) => {
  const requestMethodColor = methodColors[req.method] || "white";
  const requestMethod = colors[requestMethodColor](req.method);
  const userAgent = colors.bgMagenta(req.headers["user-agent"].slice(0, 35));
  const url = colors.cyan(req.url);
  const arrow = colors.magenta("=>");

  logger.info(`${userAgent} ${requestMethod} ${arrow} ${url}`);
  next();
};

module.exports = serverLog;
