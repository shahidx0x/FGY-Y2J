const serverMaintain = (req, res, next) => {
  if (process.env.MAINTENANCE_MODE === "true") {
    return res
      .status(503)
      .json({ status: 503, message: "Server is in maintenance" });
  }
  next();
};
module.exports = serverMaintain;
