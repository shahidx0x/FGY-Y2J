const Cart = require("./carts.model");
const Products = require("../products/products.model");
const mongoose = require("mongoose");
const cartController = {
  
addItem: async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const user_email = req.userEmail;

    const cart = await Cart.findOneAndUpdate(
      { user_email, isUpdating: false },
      { $set: { isUpdating: true } },
      { upsert: true, new: true }
    );

    if (!cart) {
      return res.status(409).json({ message: "Please wait for the update to complete." });
    }

    let product = await Products.findById(product_id);

    if (!product) {
      cart.isUpdating = false;
      await cart.save();
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.isDisable) {
      cart.isUpdating = false;
      await cart.save();
      return res.status(200).json({ message: "Product is not available right now" });
    }

    if (product.discount > 0) {
      product.afterDiscount = (product.price * (100 - product.discount)) / 100;
    } else {
      product.afterDiscount = product.price;
    }

    const {
      name,
      price,
      afterDiscount,
      discount,
      product_image,
      product_unit_type,
      product_unit_quantity,
      unit_flag,
    } = product;

    const itemIndex = cart.items.findIndex(
      (item) => item.product_id.toString() === product_id.toString()
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product_name: name,
        product_image,
        product_id,
        quantity,
        product_unit_type,
        product_unit: `${product_unit_type}/${product_unit_quantity}`,
        product_unit_value: product_unit_quantity,
        unit_flag,
        price,
        afterDiscount,
        discount,
      });
    }

    cart.isUpdating = false;
    await cart.save();

    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

  getUserCart: async (req, res) => {
    try {
      const { user_email } = req.params;
      const cart = await Cart.findOne({ user_email });

      if (!cart) {
        return res.status(200).json({ message: "Cart is empty" });
      }

      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateItemQuantity: async (req, res) => {
    try {
      const { user_email, product_id, quantity } = req.body;
      const cart = await Cart.findOne({ user_email });

      if (!cart) {
        return res.status(200).json({ message: "Cart is empty" });
      }
      const itemIndex = cart.items.findIndex(
        (item) => item.product_id.toString() === product_id
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
      } else {
        return res.status(200).json({ message: "Item not found in cart" });
      }

      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  emptyCart: async (req, res) => {
    try {
      const { user_email } = req.params;

      let cart = await Cart.findOne({ user_email });

      if (!cart) {
        return res.status(200).json({ message: "Cart is empty" });
      }

      cart.items = [];
      cart.total = 0;

      await cart.save();
      res.status(200).json({ message: "Cart has been emptied", cart });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = cartController;
