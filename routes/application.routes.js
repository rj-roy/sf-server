import express from 'express';
import { verifyFounder } from '../middlewares/roleGuards.js';
import { verifyCollaborator } from '../middlewares/roleGuards.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import {
    getApplicationsByFounder,
    getApplicationsByCollaborator,
    updateApplicationStatus,
    cancelApplicationStatus,
} from '../controllers/application.controller.js';

const router = express.Router();

router.get('/founder/:id', getApplicationsByFounder);
router.get('/collaborator/:id', getApplicationsByCollaborator);

router.patch(
    '/update/status/:id',
    verifyToken,
    verifyFounder,
    updateApplicationStatus,
); 

router.patch(
    '/update/status/cancelled/:id',
    verifyToken,
    verifyCollaborator,
    cancelApplicationStatus,
); 

export default router;
