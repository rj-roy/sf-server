import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { getPlan } from '../controllers/plan.controller.js';

const router = express.Router();

router.get('/', verifyToken, getPlan)

export default router;