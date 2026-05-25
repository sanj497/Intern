import Cart from '../model/cartModel.js';
import Product from '../model/product.js';

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) return res.json({ items: [] });
    res.json({ items: cart.items });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const saveCart = async (req, res) => {
  try {
    const { items } = req.body;
    const cartItems = [];

    for (const item of items) {
      // Use .lean() to get raw MongoDB document — bypasses schema field filtering
      const product = await Product.findById(item.productId || item._id).lean();
      if (product) {
        // Handle both capital and lowercase field names in DB
        const productName = product.ProductName || product.productName || 'Unknown';
        const price       = Number(product.Price || product.price || 0);
        const thumbnail   = product.Thumbnail || product.thumbnail || '';

        cartItems.push({
          product: product._id,
          productName,
          price,
          thumbnail,
          quantity: parseInt(item.quantity, 10) || 1
        });
      }
    }

    const cart = await Cart.findOneAndUpdate(
      { user: req.user.userId },
      { user: req.user.userId, items: cartItems },
      { upsert: true, new: true }
    );

    res.json({ message: 'Cart saved', items: cart.items });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user.userId }, { items: [] });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};