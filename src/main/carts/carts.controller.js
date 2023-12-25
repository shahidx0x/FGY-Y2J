const Cart = require("./carts.model");
const Products = require("../products/products.model");
const mongoose = require("mongoose");
const cartController = {
  addItem: async (req, res) => {
    try {
      const { product_id, quantity } = req.body;
      const user_email = req.userEmail;
      let product = await Products.findById(product_id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.isDisable) {
        return res
          .status(200)
          .json({ message: "Product is not available right now" });
      }

      if (product.discount > 0) {
        product.afterDiscount =
          product.price - (product.price * product.discount) / 100;
      } else if (product.discount === 0 || product.discount < 0) {
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

      let cart = await Cart.findOneAndUpdate(
        { user_email, "items.product_id": product_id },
        {
          $inc: { "items.$.quantity": quantity },
        },
        { new: true }
      );

      if (!cart) {
        cart = await Cart.findOneAndUpdate(
          { user_email },
          {
            $push: {
              items: {
                product_name: name,
                product_image,
                product_id,
                product_unit_type,
                product_unit: product_unit_type + "/" + product_unit_quantity,
                product_unit_value: product_unit_quantity,
                unit_flag,
                quantity,
                price,
                afterDiscount,
                discount,
              },
            },
          },
          { new: true, upsert: true }
        );
      }

      res.status(201).json(cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  
  removeItem: async (req, res) => {
    try {
      const { user_email, product_id } = req.body;

      const cart = await Cart.findOne({ user_email });
      if (!cart) {
        return res.status(200).json({ message: "Cart is empty" });
      }
      cart.items = cart.items.filter(
        (item) => item.product_id.toString() !== product_id
      );

      await cart.save();
      res.status(200).json(cart);
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
