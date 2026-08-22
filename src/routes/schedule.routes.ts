import express, { type Request, type Response } from 'express';
import Schedule from '../models/schedule.model.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    res.json({ message: 'schedule' });
});

export default router;
