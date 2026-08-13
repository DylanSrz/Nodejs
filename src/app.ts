import express from 'express';
import 'dotenv/config';
import db from './config/db.js';
import routerBook from './routes/book.routes.js';
import routerBooking from './routes/booking.routes.js';


const {PORT} = process.env;

const app = express();

app.use(express.json());
app.use('/book', routerBook);
app.use('/booking', routerBooking);

start();

async function start() {
    await db.authenticate();

    // await db.sync({alter: true})

    app.listen(PORT, () => {
        console.log(`server running in port ${PORT}`);
    })
    
}