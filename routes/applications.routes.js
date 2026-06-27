import express from 'express';
import { getAllApplications } from '../controllers/application.controller.js';

const router = express.Router();

router.get('/', getAllApplications); 

export default router;