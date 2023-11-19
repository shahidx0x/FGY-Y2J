const Orders = require("./orders.model");

const orders_controller = {
  get_all_orders: async function (req, res) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      let limit = parseInt(req.query.limit, 10) || 10;
      const search = req.query.search;
      const orderStatus = req.query.order_status;

      let query = {};

      if (search) {
        query.user_email = search;
      }
      if (orderStatus) {
        query.order_status = orderStatus;
      }

      if (req.query.order_list === "today") {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        query.createdAt = {
          $gte: todayStart,
          $lte: todayEnd,
        };
      }

      if (limit === -1) {
        const orders = await Orders.find(query).sort({ createdAt: -1 });
        return res.status(200).json({ data: orders });
      }

      const skip = (page - 1) * limit;
      const orders = await Orders.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
      const totalOrders = await Orders.countDocuments(query);

      const paginationInfo = {
        totalOrders,
        limit,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
      };

      res.status(200).json({
        meta: paginationInfo,
        data: orders,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving orders",
        error: error.message,
      });
    }
  },

  create_new_order: async function (req, res) {
    try {
      const new_order = new Orders(req.body);
      const order = await new_order.save();
      res.status(200).json({
        message: "Order successfully placed!",
        order,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to place order",
        error: error.message,
      });
    }
  },
  update_order: async function (req, res) {
    try {
      const orderId = req.params.id;
      const updateData = req.body;
      const updatedOrder = await Orders.findByIdAndUpdate(orderId, updateData, {
        new: true,
      });

      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({
        message: "Order updated successfully",
        data: updatedOrder,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error updating order",
        error: error.message,
      });
    }
  },
  remove_order: async function (req, res) {
    try {
      const { id } = req.params;

      const order = await Orders.findByIdAndRemove(id);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({
        message: "Order removed successfully",
        order,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error removing order",
        error: error.message,
      });
    }
  },
};

module.exports = orders_controller;
