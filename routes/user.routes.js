import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { updateOwnProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.patch('/update/:id', verifyToken, updateOwnProfile); 

export default router;
