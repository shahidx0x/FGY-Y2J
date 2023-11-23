const { default: axios } = require("axios");
const Orders = require("./orders.model");
const config = require("../../../configs/config");

const orders_controller = {
  get_all_orders: async function (req, res) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      let limit = parseInt(req.query.limit, 10) || 10;
      const search = req.query.search;
      const orderStatus = req.query.order_status;
      const shouldPopulateUser = req.query.populate === "user";

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

      let ordersQuery = Orders.find(query);

      if (shouldPopulateUser) {
        ordersQuery = ordersQuery.populate({
          path: "user_id",
          select:
            "cartNumber email company company_slug firstName lastName phoneNumber location zipCode",
        });
      }

      if (limit === -1) {
        const orders = await ordersQuery.sort({ createdAt: -1 });
        return res.status(200).json({ data: orders });
      }

      const skip = (page - 1) * limit;
      const orders = await ordersQuery
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
      let user_id = req.userId;
      const { user_name, user_email } = req.body;
      const new_order = new Orders(req.body);
      new_order.user_id = user_id;
      const order = await new_order.save();
      try {
        await axios.post(config.domain + `/notifications`, {
          message: `New Order Pending from ${user_name}`,
          user_email: user_email,
          userId: user_id,
          link: "/dashbord/manage/orders",
        });
        await axios.post(config.domain + `notify/order/pending/${user_email}/${user_name}`)
      } catch (AxiosError) {
        console.log(AxiosError);
      }
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
