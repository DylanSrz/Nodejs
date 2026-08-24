import express, { type Request, type Response } from 'express';
import Roles from '../models/role.model.js';

const router = express.Router();

router.get('/', async(req: Request, res: Response) => {

    try{

        const roles = await Roles.findAll();

        res.json(roles);

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'error en el servidor'});
    }
});



export default router;
