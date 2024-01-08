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
      let notify_filter = req.query.notification;
      let get_unread = req.query.unread;
      let query = {};

      if (get_unread) {
        query.read = false;
      }

      if (qemail) {
        query.user_email = qemail;
      }
      let unread = await Notification.find(query).countDocuments();
  
      if (notify_filter) {
        query.category = notify_filter;
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
          unread: unread,
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
      const updatedNotification = await Notification.findByIdAndUpdate(
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
  markAsAllRead: async (req, res) => {
    try {
      const user_email = req.query.user_email;
      await Notification.updateMany(
        { user_email: user_email },
        { $set: { read: true } }
      );
      res
        .status(200)
        .json({
          message: `All notifications for user ${user_email} marked as read successfully.`,
        });
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error marking notifications as read",
          error: error.message,
        });
    }
  },
};

module.exports = notificationController;
