import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { verifyCollaborator } from '../middlewares/roleGuards.js';
import { createApplication } from '../controllers/application.controller.js';

const router = express.Router();

router.post(
    '/application/create',
    verifyToken,
    verifyCollaborator,
    createApplication,
);

export default router;
