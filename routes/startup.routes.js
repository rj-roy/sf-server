import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { verifyFounder, verifyAdmin } from '../middlewares/roleGuards.js';
import {
    verifyStartupNotAlreadyCreated,
    verifyStartupOwner,
} from '../middlewares/verifyStartupOwner.js';
import {
    createStartup,
    updateStartupStatus,
    updateStartup,
    deleteStartup,
} from '../controllers/startup.controller.js';

const router = express.Router();

router.post(
    '/create',
    verifyToken,
    verifyFounder,
    verifyStartupNotAlreadyCreated,
    createStartup,
); 

router.patch(
    '/status/update/:id',
    verifyToken,
    verifyAdmin,
    updateStartupStatus,
); 

router.patch(
    '/:id',
    verifyToken,
    verifyFounder,
    verifyStartupOwner,
    updateStartup,
); 

router.delete(
    '/delete/:id',
    verifyToken,
    verifyStartupOwner,
    deleteStartup,
); 

export default router;
