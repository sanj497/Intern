import express from 'express';
import { isAuthenticated, isAdmin } from '../middleware/middleware.js';
import {
  adminLogin,
  getAllUsers, updateUser, deleteUser,
  adminGetAllProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
  adminGetAllOrders, adminUpdateOrderStatus,
  adminGetAllMessages, adminMarkMessageRead, adminDeleteMessage,
} from '../controller/adminController.js';

const router = express.Router();

// Auth
router.post('/admin/login', adminLogin);

// Users
router.get('/admin/users',      isAuthenticated, isAdmin, getAllUsers);
router.put('/admin/users/:id',  isAuthenticated, isAdmin, updateUser);
router.delete('/admin/users/:id', isAuthenticated, isAdmin, deleteUser);

// Products
router.get('/admin/products',        isAuthenticated, isAdmin, adminGetAllProducts);
router.post('/admin/products',       isAuthenticated, isAdmin, adminCreateProduct);
router.put('/admin/products/:id',    isAuthenticated, isAdmin, adminUpdateProduct);
router.delete('/admin/products/:id', isAuthenticated, isAdmin, adminDeleteProduct);

// Orders
router.get('/admin/orders',           isAuthenticated, isAdmin, adminGetAllOrders);
router.put('/admin/orders/:id/status',isAuthenticated, isAdmin, adminUpdateOrderStatus);

// Messages
router.get('/admin/messages',          isAuthenticated, isAdmin, adminGetAllMessages);
router.put('/admin/messages/:id/read', isAuthenticated, isAdmin, adminMarkMessageRead);
router.delete('/admin/messages/:id',   isAuthenticated, isAdmin, adminDeleteMessage);

export default router;