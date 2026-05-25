import express from 'express';
import { isAuthenticated } from '../middleware/middleware.js';
import { getCart, saveCart, clearCart } from '../controller/cartController.js';

const router = express.Router();

router.get('/cart', isAuthenticated, getCart);
router.post('/cart/save', isAuthenticated, saveCart);
router.delete('/cart/clear', isAuthenticated, clearCart);

export default router;