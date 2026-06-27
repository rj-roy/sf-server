import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { createSubscription } from '../controllers/subscription.controller.js';


const router = express.Router();

router.post('/create', verifyToken, createSubscription);

export default router;