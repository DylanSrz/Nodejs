import express, { type Request, type Response } from 'express';
import Clan from '../models/clan.model.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    res.json({ message: 'clan' });
});

export default router;
