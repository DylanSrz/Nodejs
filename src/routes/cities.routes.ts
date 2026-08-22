import express, { type Request, type Response } from 'express';
import Cities from '../models/cities.model.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    res.json({ message: 'cities' });
});

export default router;
