const Cart = require("../carts/carts.model");
const Products = require("../products/products.model");

const updateCartItemDetails = async (req, res, next) => {
  try {
    const user_email = req.userEmail || req.params.user_email;
    let cart = await Cart.findOne({ user_email });

    if (!cart) {
      return next();
    }

    let isCartUpdated = false;
    const updatedItems = [];

    for (const item of cart.items) {
      const product = await Products.findById(item.product_id);
      if (product) {
        let itemUpdated = false;
        if (product.price !== item.price) {
          item.price = product.price;
          itemUpdated = true;
        }
        if (product.product_image !== item.product_image) {
          item.product_image = product.product_image;
          itemUpdated = true;
        }
        if (product.name !== item.product_name) {
          item.product_name = product.name;
          itemUpdated = true;
        }
        if (itemUpdated) {
          isCartUpdated = true;
        }
        updatedItems.push(item);
      } else {
        isCartUpdated = true;
      }
    }

    if (isCartUpdated) {
      cart.items = updatedItems;
      await cart.save();
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = updateCartItemDetails;
