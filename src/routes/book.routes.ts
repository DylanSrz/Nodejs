import express, { type Request, type Response } from 'express';
import Book from '../models/book.model.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createBookSchema } from '../dto/create-book.schema.js';

const router = express.Router();

router.post('/', validateRequest(createBookSchema) ,async(req: Request, res: Response) => {
    const {name, author} = req.body;

    try{

        const book = await Book.create({name, author});

        res.json({message: 'libro creado', book});

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'error en el servidor'});
    }
});

router.get('/', async(req: Request, res: Response) => {
    try{

        const books = await Book.findAll();

        res.json(books);

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'error en el servidor'});
    }
});

router.put('/:id', async(req: Request, res: Response) => {
    try{

        const {name, author, availability} = req.body;

        const id = Number(req.params.id)

        const bookExists = await Book.findByPk(id);

        if(!bookExists){
            return res.status(404).json({message: 'libro no existe'})
        }

        bookExists.update({name, author, availability})

        res.json({message: 'libro actualizado', book: bookExists});

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'error en el servidor'});
    }
});

router.delete('/:id', async(req: Request, res: Response) => {
    try{

        const id = Number(req.params.id)

        const bookExists = await Book.findByPk(id);

        if(!bookExists){
            return res.status(404).json({message: 'libro no existe'})
        }

        bookExists.destroy();

        res.json({message: 'libro eliminado'});

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'error en el servidor'});
    }
});

export default router;