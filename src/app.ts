import express, { Router, type Request, type Response } from "express";
import "dotenv/config";
import  db  from "./config/db.js";
import Product from "./models/product.js";
import routerProduct from "./routes/product.roules.js";


const app = express()
app.use(express.json())

app.use('/product', routerProduct)

const {PORT} = process.env

app.get('/user', async (req: Request, res: Response) => {
    const user = await db.query('SELECT * FROM users')

    res.json({user})
})

starServer()


async function starServer() {

    try {
        await db.authenticate()
        console.log('DB Online')

        await db.sync()
        console.log('DB sincronizada')

    } catch(error) {
        throw error
    }

    app.listen(PORT, () => {
    console.log(`server running in port ${PORT}...`)
})
}