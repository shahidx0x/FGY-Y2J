const Cart = require("./carts.model");
const Products = require("../products/products.model");
const cartController = {
  addItem: async (req, res) => {
    try {
      const { product_id, quantity } = req.body;
      const user_email = req.userEmail;
      const product = await Products.findById(product_id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const { name, price, afterDiscount, discount, product_image } = product;
      let product_name = name;

      let cart = await Cart.findOne({ user_email });
      if (!cart) {
        cart = new Cart({
          user_email,
          items: [
            {
              product_name,
              product_image,
              product_id,
              quantity,
              price,
              afterDiscount,
              discount,
            },
          ],
        });
      } else {
        const itemIndex = cart.items.findIndex(
          (item) => item.product_id === product_id
        );

        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += quantity;
        } else {
          cart.items.push({
            product_name,
            product_image,
            product_id,
            quantity,
            price,
            afterDiscount,
            discount,
          });
        }
      }

      await cart.save();
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
        return res.status(404).json({ message: "Cart not found" });
      }

      cart.items = cart.items.filter((item) => item.product_id !== product_id);

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
        return res.status(404).json({ message: "Cart not found" });
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
        return res.status(404).json({ message: "Cart not found" });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.product_id === product_id
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
      } else {
        return res.status(404).json({ message: "Item not found in cart" });
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
        return res.status(404).json({ message: "Cart not found" });
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
