import express from 'express'
import 'dotenv/config'
import db from './config/db.js'


const {PORT} = process.env 

const app = express()

app.use(express.json())

// ENDPOINTS DE MI API
// app.use('/coder', routerCoder)

async function start()  {

    await db.authenticate()

    await db.sync({alter: true})

    app.listen(PORT, () => {
        console.log(`Server running in PORT: ${PORT}`)
    })
}