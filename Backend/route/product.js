import express from 'express';
import { createProduct, getAllProducts, getProductById } from '../controller/productController.js';
import Product from '../model/product.js';
import { isAuthenticated, isAdmin } from '../middleware/middleware.js';

const router = express.Router();

router.get('/', getAllProducts);
router.post('/', isAuthenticated, isAdmin, createProduct);
router.get('/:id', getProductById);

// Update product (admin)
router.put('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product updated', data: updated });
  } catch (err) {
    res.status(400).json({ error: 'Update failed', details: err.message });
  }
});

// Delete product (admin)
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed', details: err.message });
  }
});

export default router;