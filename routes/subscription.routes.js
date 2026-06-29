import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { createSubscription, isExistSubscription } from '../controllers/subscription.controller.js';


const router = express.Router();

router.post('/create', verifyToken, createSubscription);
router.get('/exist', verifyToken, isExistSubscription);

export default router;