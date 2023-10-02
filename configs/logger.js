const winston = require("winston");
const { getClientIp, getUserAgent } = require("../utils/Utils");

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});
const requestInfoFormat = winston.format.printf((info) => {
  if (info.req) {
    return `IP: ${getClientIp(info.req)}, User-Agent: ${getUserAgent(
      info.req
    )} - ${info.message}`;
  }
  return info.message;
});
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    enumerateErrorFormat(),
    winston.format.colorize(),
    winston.format.splat(),
    requestInfoFormat,
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
  ],
});

module.exports = logger;
