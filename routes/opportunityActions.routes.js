import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { verifyFounder } from '../middlewares/roleGuards.js';
import { verifyOpportunityOwner } from '../middlewares/verifyOpportunityOwner.js';
import {
    createOpportunity,
    deleteOpportunity,
    updateOpportunity,
} from '../controllers/opportunity.controller.js';

const router = express.Router();

router.post('/create', verifyToken, verifyFounder, createOpportunity); 

router.delete(
    '/delete/:id',
    verifyToken,
    verifyFounder,
    verifyOpportunityOwner,
    deleteOpportunity,
);

router.patch(
    '/update/:id',
    verifyToken,
    verifyFounder,
    verifyOpportunityOwner,
    updateOpportunity,
); 

export default router;
