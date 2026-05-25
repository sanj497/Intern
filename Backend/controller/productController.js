import Product from '../model/product.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ data: products });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
};


export const createProduct = async (req, res) => {
  try {
    
    const price = req.body.price.value.toString();

    const newProduct = new Product({
      ...req.body,
      price
    });

    await newProduct.save();

    res.status(201).json({ message: 'Product created', data: newProduct });
  } catch (err) {
    console.error('Error creating product:', err);

    res.status(400).json({
      error: 'Failed to create product',
      details: err.message
    });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ data: product });
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// ======= Favorite Controllers =======

// Add product to user's favorites
export const addToFavorites = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(404).json({ message: 'User or Product not found' });
    }

    if (user.favorites && user.favorites.includes(productId)) {
      return res.status(400).json({ message: 'Product already in favorites' });
    }

    user.favorites = user.favorites || [];
    user.favorites.push(productId);
    await user.save();

    res.status(200).json({
      message: 'Product added to favorites',
      userId: user._id,
      productId: product._id,
      favorites: user.favorites
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get user's favorites with product details
export const getUserFavorites = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('favorites');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      userId: user._id,
      favorites: user.favorites.map(product => ({
        productId: product._id,
        productName: product.productName,
        price: product.price,
        thumbnail: product.thumbnail,
        description: product.description
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};