import express, { type Request, type Response } from 'express';
import User from '../models/user.model.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    res.json({ message: 'user' });
});

export default router;
