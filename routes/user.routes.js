import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { updateOwnProfile, updateUserPlan } from '../controllers/user.controller.js';

const router = express.Router();

router.patch('/update/:id', verifyToken, updateOwnProfile);
router.patch('/plan/update/:id', verifyToken, updateUserPlan)

export default router;
