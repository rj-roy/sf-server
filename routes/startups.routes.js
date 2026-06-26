import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { verifyAdmin } from '../middlewares/roleGuards.js';
import {
    getAllStartups,
    getApprovedStartups,
    getPendingStartups,
    getRejectedStartups,
    getStartupsByField,
    getStartupByFounder,
    getStartupById,
} from '../controllers/startup.controller.js';

const router = express.Router();

router.get('/', getAllStartups);
router.get('/approved', getApprovedStartups);
router.get('/pending', verifyToken, getPendingStartups);
router.get('/rejected', verifyToken, verifyAdmin, getRejectedStartups);
router.get('/field', getStartupsByField);
router.get('/founder/:id', getStartupByFounder);
router.get('/:id', getStartupById);

export default router;
