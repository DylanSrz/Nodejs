import express from 'express'
import 'dotenv/config'
import db from './config/db.js'


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


const {PORT} = process.env 

const app = express()

app.use(express.json())

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

start()

async function start()  {

    await db.authenticate()

    await db.sync({alter: true})

    app.listen(PORT, () => {
        console.log(`Server running in PORT: ${PORT}`)
    })
}