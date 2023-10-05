const serverMaintain = (req, res, next) => {
  if (process.env.MAINTENANCE_MODE === "true") {
    return res.status(503).send("Server is in maintenance");
  }
  next();
};
module.exports = serverMaintain;
