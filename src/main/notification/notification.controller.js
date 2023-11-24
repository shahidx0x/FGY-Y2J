const Notification = require("./notification.model");
const notificationController = {
  createNotification: async (req, res) => {
    try {
      const notification = new Notification(req.body);
      await notification.save();
      res
        .status(200)
        .json({ message: "Notification created successfully", Notification });
    } catch (error) {
      res.status(500).json({ message: "Error creating Notification", error });
    }
  },

  getAllNotifications: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      let limit = parseInt(req.query.limit, 10) || 10;
      let skip = (page - 1) * limit;
      let qemail = req.query.email;
      let query = {};
      if (qemail) {
        query.user_email = qemail;
      }
      const totalNotifications = await Notification.countDocuments(query);
      let notifications;
      if (limit === -1) {
        notifications = await Notification.find(query).sort({ date: -1 });
        limit = totalNotifications;
      } else {
        notifications = await Notification.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ date: -1 });
      }

      const tenMinutesAgo = new Date(Date.now() - 10 * 60000);
      notifications = notifications.map((notification) => {
        return {
          ...notification.toObject(),
          isRecent: notification.date > tenMinutesAgo,
        };
      });

      const totalPages = Math.ceil(totalNotifications / limit);

      res.status(200).json({
        status: 200,
        meta: {
          total_Notifications: totalNotifications,
          total_page: totalPages,
          current_page: page,
          per_page: limit,
        },
        data: notifications,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching Notifications", error });
    }
  },

  updateNotificationById: async (req, res) => {
    try {
      const updatedNotification = await Notifications.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedNotification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.status(200).json({
        message: "Notification updated successfully",
        status: 200,
        Notification: updatedNotification,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating Notification", error });
    }
  },
};

module.exports = notificationController;
