import express, { type Request, type Response } from 'express';
import Room from '../models/room.model.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    res.json({ message: 'room' });
});

export default router;
