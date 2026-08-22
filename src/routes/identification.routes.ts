import express, { type Request, type Response } from 'express';
import Identification from '../models/identification.model.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    res.json({ message: 'identification' });
});

export default router;
