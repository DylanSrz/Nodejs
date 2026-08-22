import express, { type Request, type Response } from 'express';
import Coder_clan from '../models/coder_clan.model.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    res.json({ message: 'coderClan' });
});

export default router;
