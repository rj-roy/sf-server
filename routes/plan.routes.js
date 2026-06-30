import express from 'express';
import { getPlan } from '../controllers/plan.controller.js';

const router = express.Router();

router.get('/', getPlan)

export default router;