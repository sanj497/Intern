import express from 'express';
import { isAuthenticated, isAdmin } from '../middleware/middleware.js';
import {
  placeOrder, getMyOrders, getOrderById,
  verifyOrderPayment, getAllOrders, updateOrderStatus, cancelOrder
} from '../controller/orderController.js';

const router = express.Router();

router.post('/orders', isAuthenticated, placeOrder);
router.get('/orders/my', isAuthenticated, getMyOrders);
router.post('/orders/verify-payment', isAuthenticated, verifyOrderPayment);
router.get('/orders/:id', isAuthenticated, getOrderById);

// Admin
router.get('/admin/orders', isAuthenticated, isAdmin, getAllOrders);
router.put('/admin/orders/:id/status', isAuthenticated, isAdmin, updateOrderStatus);
router.put('/admin/orders/:id/cancel', isAuthenticated, isAdmin, cancelOrder);

export default router;