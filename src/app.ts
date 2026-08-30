import express from 'express'
import 'dotenv/config'
import swaggerUi from 'swagger-ui-express'
import db from './config/db.js'
import { swaggerSpec } from './config/swagger.js'
import { errorHandler, notFoundHandler } from './middlewares/error_handler.js'


import routerRoles from './routes/role.routes.js'
import routerTypeIdentification from './routes/type_identification.routes.js'
import routerCities from './routes/cities.routes.js'
import routerSchedule from './routes/schedule.routes.js'
import routerTypeRoute from './routes/type_route.routes.js'
import routerIdentification from './routes/identification.routes.js'
import routerAddressUser from './routes/address_user.routes.js'
import routerCampus from './routes/campus.routes.js'
import routerRoom from './routes/room.routes.js'
import routerUser from './routes/user.routes.js'
import routerClan from './routes/clan.routes.js'
import routerCoderClan from './routes/coder_clan.routes.js'
import routerAuth from './routes/auth.routes.js'


const {PORT} = process.env

const app = express()

app.use(express.json())

// DOCUMENTACION DE LA API (Swagger UI)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'riwiHack API - Documentación',
    swaggerOptions: {
        // Conserva el token entre recargas de la página.
        persistAuthorization: true
    }
}))

// documento OpenAPI en crudo, util para Postman o clientes externos.
app.get('/api-docs.json', (req, res) => {
    res.json(swaggerSpec)
})


/**
 * @openapi
 * /:
 *   get:
 *     tags: [Servicio]
 *     summary: Índice de la API
 *     description: Devuelve el nombre, la versión y la ruta de la documentación.
 *     security: []
 *     responses:
 *       200:
 *         description: Datos básicos del servicio.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name: { type: string, example: riwiHack API }
 *                 version: { type: string, example: 1.0.0 }
 *                 docs: { type: string, example: /api-docs }
 */
// punto de entrada: indica a donde ir.
app.get('/', (req, res) => {
    res.json({
        name: 'riwiHack API',
        version: '1.0.0',
        docs: '/api-docs'
    })
})


/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Servicio]
 *     summary: Estado del servicio
 *     description: |
 *       Comprueba que la conexión con PostgreSQL siga viva, no solo que el
 *       proceso de Node responda.
 *     security: []
 *     responses:
 *       200:
 *         description: El servicio y la base de datos responden.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: ok }
 *                 database: { type: string, example: up }
 *       503:
 *         description: La base de datos no responde.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: error }
 *                 database: { type: string, example: down }
 */
app.get('/health', async (req, res) => {

    try {
        await db.authenticate()
        res.status(200).json({status: 'ok', database: 'up'})
    } catch(error) {
        res.status(503).json({status: 'error', database: 'down'})
    }
})


// ENDPOINTS DE MI API
app.use('/roles', routerRoles)
app.use('/type_identification', routerTypeIdentification)
app.use('/cities', routerCities)
app.use('/schedule', routerSchedule)
app.use('/type_route', routerTypeRoute)
app.use('/identification', routerIdentification)
app.use('/address_user', routerAddressUser)
app.use('/campus', routerCampus)
app.use('/room', routerRoom)
app.use('/user', routerUser)
app.use('/clan', routerClan)
app.use('/coder_clan', routerCoderClan)
app.use('/auth', routerAuth)


// Ninguna ruta coincidió: 404 en JSON.
//
// Va después de todos los routers.
app.use(notFoundHandler)


// Manejador global de errores.
//
// Debe montarse SIEMPRE de último: Express lo reconoce por
// sus cuatro parámetros y le entrega cualquier error que
// lancen los controladores.
app.use(errorHandler)


start()

async function start()  {

    try {


        await db.authenticate()

        // await db.sync({alter: true})

        app.listen(PORT, () => {
            console.log(`Server running in PORT: ${PORT}`)
            console.log(`Docs disponibles en: http://localhost:${PORT}/api-docs`)
        })
    } catch(error) {
        console.log(error)
        console.log('Error en APP')
    }
}
