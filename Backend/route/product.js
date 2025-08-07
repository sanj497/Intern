import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  
} from '../controller/productController.js';

const router = express.Router();

// Product routes
router.get('/', getAllProducts);
router.post('/', createProduct);
router.get('/:id', getProductById);

export default router;
