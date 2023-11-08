const Notify = require("./notify.model");

const notify_controller = {
  getAllNotifies: async function (req, res) {
    let { page = 1, limit = 10, search = "" } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (isNaN(page) || isNaN(limit)) {
      return res
        .status(400)
        .json({ message: "Invalid page or limit parameter" });
    }

    try {
      let query = {};
      if (search) {
        query.user_email = { $regex: search, $options: "i" };
      }

      if (limit === -1) {
        const notifications = await Notify.find(query);
        return res.status(200).json(notifications);
      }

      const skip = (page - 1) * limit;
      const notifications = await Notify.find(query).skip(skip).limit(limit);
      const totalItems = await Notify.countDocuments(query);

      const paginationInfo = {
        totalItems,
        limit,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        hasNextPage: page * limit < totalItems,
        hasPrevPage: page > 1,
      };

      res.status(200).json({
        meta: paginationInfo,
        data: notifications,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving notifications",
        error: error.message,
      });
    }
  },
  createNotify: async function (req, res) {
    try {
      const { user_email, order_status, user_name, user_address, orders } =
        req.body;

      const notification = await Notify.findOneAndUpdate(
        { user_email: user_email },
        {
          $set: { user_name, user_address, order_status },
          $push: { orders: { $each: orders } },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      res.status(201).json({
        message: "Order added to notification successfully!",
        notification,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to add order to notification",
        error: error.message,
      });
    }
  },
  removeNotifyById: async function (req, res) {
    try {
      const { id } = req.params;

      const notification = await Notify.findByIdAndRemove(id);

      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      res.status(200).json({
        message: "Notification removed successfully",
        notification,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error removing notification",
        error: error.message,
      });
    }
  },
};

module.exports = notify_controller;
