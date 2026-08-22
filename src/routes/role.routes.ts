import express, { type Request, type Response } from 'express';
import Roles from '../models/role.model.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    res.json({ message: 'role' });
});

export default router;
