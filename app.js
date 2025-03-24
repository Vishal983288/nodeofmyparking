const express=require('express')
const mongoose =require("mongoose")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json());
//https://node5.onrender.com/user/user : domain + endpoints
//http://localhost:3000/test

const roleRoutes = require('./src/routes/RoleRoutes')
app.use(roleRoutes)
const userRoutes = require('./src/routes/UserRouters');
app.use(userRoutes)
const stateRoute = require('./src/routes/StateRoutes');
app.use(stateRoute)
const cityRoute = require('./src/routes/CityRoutes');
app.use(cityRoute)
const areaRoute = require('./src/routes/AreaRoutes');
app.use(areaRoute)
const vehicleRoute = require('./src/routes/VehicleRoutes');
app.use(vehicleRoute)
const parkngRoutes = require('./src/routes/ParkingRoutes');
app.use(parkngRoutes)
const reservationRoutes = require('./src/routes/ReservationRoutes');
app.use('/reservation', reservationRoutes)







mongoose.connect('mongodb://localhost:27017/node_25').then(()=>{
console.log('database connected...');

})


const PORT  =3000
app.listen(PORT,()=>{

    console.log('Now server is started at port number',PORT)

})
