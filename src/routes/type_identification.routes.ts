import express, { type Request, type Response } from 'express';
import Type_identification from '../models/type_identification.model.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    res.json({ message: 'type.identification' });
});

export default router;
