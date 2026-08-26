import express from 'express';
import { createClan, getClan } from '../controllers/clan.controller.js';

const router = express.Router();

router.get('/', getClan);
router.post('/', createClan)

export default router;
