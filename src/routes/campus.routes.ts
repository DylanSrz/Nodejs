import express, { type Request, type Response } from 'express';
import Campus from '../models/campus.model.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    res.json({ message: 'campus' });
});

export default router;
