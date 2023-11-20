const Transaction = require("./transaction.model");

const transactionController = {
  create_transaction: async (req, res) => {
    try {
      const newTransaction = new Transaction(req.body);
      const savedTransaction = await newTransaction.save();
      res.status(201).send(savedTransaction);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  update_transaction: async (req, res) => {
    try {
      const updatedTransaction = await Transaction.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedTransaction) {
        return res.status(404).send();
      }
      res.send(updatedTransaction);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  transaction_list: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      let limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;
      const search = req.query.search || "";
      let query = {};
      if (search) {
        query.email = search;
      }

      const totalTransaction = await Transaction.countDocuments(query);

      const now = new Date();
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfYear = new Date(now.getFullYear(), 0, 1);

      const salesAggregation = await Transaction.aggregate([
        {
          $match: query,
        },
        {
          $group: {
            _id: null,
            totalSell: { $sum: "$amount" },
            todayTotalSell: {
              $sum: {
                $cond: [{ $gte: ["$createdAt", startOfDay] }, "$amount", 0],
              },
            },
            weeklyTotalSell: {
              $sum: {
                $cond: [{ $gte: ["$createdAt", startOfWeek] }, "$amount", 0],
              },
            },
            monthlyTotalSell: {
              $sum: {
                $cond: [{ $gte: ["$createdAt", startOfMonth] }, "$amount", 0],
              },
            },
            yearlyTotalSell: {
              $sum: {
                $cond: [{ $gte: ["$createdAt", startOfYear] }, "$amount", 0],
              },
            },
          },
        },
      ]);

      let totals = salesAggregation[0] || {};

      let transactions;
      if (limit === -1) {
        transactions = await Transaction.find(query).sort({ createdAt: -1 });
      } else {
        transactions = await Transaction.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 });
      }

      const total_page = limit === -1 ? 1 : Math.ceil(totalTransaction / limit);

      res.status(200).json({
        status: 200,
        meta: {
          total_transaction: totalTransaction,
          total_page: total_page,
          current_page: page,
          per_page: limit === -1 ? totalTransaction : limit,
          totals: totals,
        },
        data: transactions,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching transaction", error: error.message });
    }
  },
};
module.exports = transactionController;
