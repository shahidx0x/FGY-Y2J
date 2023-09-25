const mongoose = require("mongoose");
const app = require("./app");
const config = require("../configs/config");
const logger = require("../configs/logger");
let server;

mongoose
  .connect(
    "mongodb+srv://shahid:191002118@parkingfinder.rhe2oic.mongodb.net/?retryWrites=true&w=majority",
    config.mongoose.options
  )
  .then(() => {
    logger.info("Connected to MongoDB");
    const ip = "0.0.0.0";
    const port = process.env.PORT || 3000;

    server = app.listen(port, ip, () => {
      logger.info(`Server is running on http://${ip}:${port}`);
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
