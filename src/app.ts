import express from 'express'
import 'dotenv/config'
import { ConnectDB } from './config/db.js'
import routerTl from './routes/tl.route.js'
import routerRuta from './routes/ruta.route.js'
import routerClan from './routes/clan.route.js'
import routerCoder from './routes/coder.route.js'
import routerAuth from './routes/auth.route.js'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger.js'

const {PORT} = process.env

const app = express()

app.use(express.json())

app.use(
    "/api",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
)

// diferentes endpoints que usaremos
app.use('/tl', routerTl)
app.use('/ruta', routerRuta)
app.use('/clan', routerClan)
app.use('/coder', routerCoder)
app.use('/auth', routerAuth)

app.listen(PORT, async () => {

    await ConnectDB()
    console.log('server running')

})