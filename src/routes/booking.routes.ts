import express, { type Request, type Response } from 'express';
import Book from '../models/book.model.js';
import User from '../models/user.model.js';
import Booking from '../models/booking.model.js';

const router = express.Router();

router.post('/', async(req: Request, res: Response) => {

    const {book_id, user_id} =req.body;

    const book = await Book.findByPk(book_id);
    if(!book){
        return res.status(404).json({message: 'el libro no existe'});
    }

    if(!book.availability){
        return res.status(409).json({message: 'el libro no disponible'});
    }

    const user = await User.findByPk(user_id);
    if(!user){
        return res.status(404).json({message: 'el usuario no existe'});
    }

    const bookingUser = await Booking.findOne({
        where: {
            user_id,
            status: 'pending'
        }
    });

    if(bookingUser){
        return res.status(409).json({message: 'el usuario tiene reservas pendientes'});
    };

    const booking = await Booking.create({book_id, user_id})

    res.json({message: 'reserva creada', booking})

});

router.post('/return', async(req: Request, res: Response) => {

    const {book_id, user_id} =req.body;

    const book = await Book.findByPk(book_id);
    if(!book){
        return res.status(404).json({message: 'el libro no existe'});
    }

    const user = await User.findByPk(user_id);
    if(!user){
        return res.status(404).json({message: 'el usuario no existe'});
    }

    const bookingUser = await Booking.findOne({
        where: {
            user_id,
            status: 'pending'
        }
    });

    if(!bookingUser){
        return res.status(409).json({message: 'el usuario no tiene reservas pendientes'});
    };

    bookingUser.update({status: 'completed'});

    res.json({message: 'reserva terminada', booking: bookingUser})

});

export default router;