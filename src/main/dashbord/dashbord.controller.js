const os = require("os");
const { checkDiskSpace } = require("node-disk-info");
module.exports = dashbordController = {
  server_status: async (req, res) => {
    try {
      const cpus = os.cpus();
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const diskInfo = await checkDiskSpace("/");
      res.json({
        cpus,
        totalMemory,
        freeMemory,
        diskInfo,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
