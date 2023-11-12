const mongoose = require("mongoose");
const app = require("./app");
const config = require("../configs/config");
const logger = require("../configs/logger");
let server;

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info(`Connected to MongoDB => ${config.mongoose.cluster}`);
  const ip = config.host;
  const port = process.env.PORT || 3000;

  server = app.listen(port, () => {
    logger.info(`Server is running on ${port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
