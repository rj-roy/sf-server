import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { verifyAdmin } from '../middlewares/roleGuards.js';
import { getAllUsers, updateUserStatus } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', verifyToken, verifyAdmin, getAllUsers); 
router.patch('/update/status/:id', verifyToken, verifyAdmin, updateUserStatus);

export default router;
