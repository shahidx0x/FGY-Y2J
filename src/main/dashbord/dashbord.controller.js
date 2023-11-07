const os = require("os");
const nodeDiskInfo = require("node-disk-info");
const Dashboard = require("./dashbord.model");

module.exports = dashboardController = {
  server_status: async (req, res) => {
    try {
      const cpus = os.cpus();
      let totalIdleTime = 0;
      let totalTickTime = 0;

      cpus.forEach((core) => {
        for (type in core.times) {
          totalTickTime += core.times[type];
        }
        totalIdleTime += core.times.idle;
      });

      const totalUtilTime = totalTickTime - totalIdleTime;
      const cpuUsagePercent = Math.round((100 * totalUtilTime) / totalTickTime);

      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const memoryUsagePercent = Math.round(
        (100 * (totalMemory - freeMemory)) / totalMemory
      );

      const diskInfo = await nodeDiskInfo.getDiskInfo();
      const diskSpace = diskInfo.find((disk) => disk.mounted === "/");
      const usedDiskSpace = diskSpace.blocks - diskSpace.available;
      const diskUsagePercent = Math.round(
        (100 * usedDiskSpace) / diskSpace.blocks
      );

      res.json({
        cpuUsage: cpuUsagePercent,
        memoryUsage: memoryUsagePercent,
        diskUsage: diskUsagePercent,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  incrementCount: async (req, res, next) => {
    const userAgent = req.get("User-Agent").toLowerCase();
    const ignoredUserAgents = ["postman", "insomnia"];
    if (ignoredUserAgents.some((ua) => userAgent.includes(ua))) {
      return next();
    }

    let update = {};

    if (userAgent.includes("android")) {
      update = { $inc: { android_user: 1 } };
    } else if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
      update = { $inc: { ios_user: 1 } };
    } else {
      return next();
    }

    try {
      await Dashboard.findOneAndUpdate({}, update, { upsert: true, new: true });
      next();
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  getPieData: async (req, res) => {
    try {
      const dashboardData = await Dashboard.findOne({});
      res.json(dashboardData);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};
