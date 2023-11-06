const os = require("os");
const nodeDiskInfo = require("node-disk-info");

module.exports = dashboardController = {
  server_status: async (req, res) => {
    try {
      // CPU Information
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

      // Memory Information
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const memoryUsagePercent = Math.round(
        (100 * (totalMemory - freeMemory)) / totalMemory
      );

      // Disk Information
      const diskInfo = await nodeDiskInfo.getDiskInfo();
      const diskSpace = diskInfo.find((disk) => disk.mounted === "/");
      // If the library provides used space directly, you should use it; otherwise, calculate it
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
};
