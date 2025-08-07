import User from '../model/usermodel.js';
import Product from '../model/product.js';

// Add product to user's favorites
export const addToFavorites = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(404).json({ message: 'User or Product not found' });
    }

    if (user.favorites.includes(productId)) {
      return res.status(400).json({ message: 'Product already favorited' });
    }

    user.favorites.push(productId);
    await user.save();

    res.status(200).json({ message: 'Product added to favorites', favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

// Get all favorite products for a user
export const getFavorites = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('favorites');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

// Get a specific favorite by product ID
export const getFavoriteById = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isFavorited = user.favorites.includes(productId);
    if (!isFavorited) {
      return res.status(404).json({ message: 'Product not found in favorites' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ favorite: product });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

// Remove a product from favorites
export const removeFromFavorites = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.favorites = user.favorites.filter(id => id.toString() !== productId);
    await user.save();

    res.status(200).json({ message: 'Removed from favorites', favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

// Clear all favorites for a user
export const clearFavorites = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.favorites = [];
    await user.save();

    res.status(200).json({ message: 'All favorites cleared', favorites: [] });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};
