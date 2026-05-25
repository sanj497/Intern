import express from 'express';
import { isAuthenticated, isAdmin } from '../middleware/middleware.js';
import { submitContact, getAllMessages, markAsRead, deleteMessage } from '../controller/contactController.js';

const router = express.Router();

router.post('/contact', submitContact);                                          // public
router.get('/admin/messages', isAuthenticated, isAdmin, getAllMessages);        // admin
router.put('/admin/messages/:id/read', isAuthenticated, isAdmin, markAsRead);  // admin
router.delete('/admin/messages/:id', isAuthenticated, isAdmin, deleteMessage); // admin

export default router;