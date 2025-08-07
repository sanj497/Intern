import express from 'express';
import {
  addToFavorites,
  getFavorites,
  getFavoriteById,
  removeFromFavorites,
  clearFavorites,
} from '../controller/favoriteController.js';

const router = express.Router();

router.post('/favorites/add', addToFavorites); // POST { userId, productId }
router.get('/favorites/:userId', getFavorites); // GET all favorites
router.get('/favorites/:userId/:productId', getFavoriteById); // GET single favorite
router.delete('/favorites/remove', removeFromFavorites); // DELETE { userId, productId }
router.delete('/favorites/clear/:userId', clearFavorites); // DELETE all favorites

export default router;
