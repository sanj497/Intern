// Rotes import express from 'express';
import { register, login } from '../controller/usercontroller.js';
import express from 'express';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router;