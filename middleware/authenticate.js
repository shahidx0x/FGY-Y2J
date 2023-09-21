const jwt = require("jsonwebtoken");
const config = require("../configs/config");
const logger = require("../configs/logger");

const authenticate = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(" ")[1];
      let user = jwt.verify(token, config.jwt.secret);
      req.userId = user.id;
      next();
    } else {
      res.status(401).json({
        message: "Unauthorized User",
      });
    }
  } catch (error) {
    logger.error(error);
    res.status(401).json({ message: "Unauthorized User" });
  }
};

module.exports = authenticate;
