import express, { type Request, type Response } from 'express';
import Address_user from '../models/address_user.model.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    res.json({ message: 'address' });
});

export default router;
