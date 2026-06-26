import express from 'express';
import {
    getAllOpportunities,
    getOpportunitiesByFounder,
    getOpportunitiesByStartup,
} from '../controllers/opportunity.controller.js';

const router = express.Router();

router.get('/', getAllOpportunities);
router.get('/founder/:id', getOpportunitiesByFounder);
router.get('/startup/:id', getOpportunitiesByStartup); 

export default router;
