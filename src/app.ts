import express, { type Request, type Response }  from 'express';
import http from 'http'
import cors from 'cors'
import { Server} from 'socket.io';
import dotenv from 'dotenv'
import type { Carrito } from './classes/carrito.js';

const app = express()
app.use(express.json())

// usamos variables de entorno 
dotenv.config()
const {PORT} = process.env

const carrito : Carrito[] = []

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*'
    }
})

io.on('connection', socket => {
    console.log(`usuario conectado ${socket.id}`)
})

app.post('/add-cart', (req: Request, res: Response) => {
    
    const {username, message, socketId} = req.body

    io.except(socketId).emit ('send-message', {username, message})

    res.json({message: 'mensaje enviado'})
})

server.listen(PORT, () => {
    console.log(`server runing in port ${PORT}...`)
})