import express, { type Request, type Response }  from 'express';
import http from 'http'
import cors from 'cors'
import { Server} from 'socket.io';

const app = express()
app.use(express.json())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*'
    }
})

io.on('connection', socket => {
    console.log(`usuario conectado ${socket.id}`)
})

app.post('/send', (req: Request, res: Response) => {
    
    const {username, message, socketId} = req.body

    io.except(socketId).emit ('send-message', {username, message})

    res.json({message: 'mensaje enviado'})
})

server.listen(3000, () => {
    console.log('server runing...')
})