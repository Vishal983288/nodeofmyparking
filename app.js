const express=require('express')
const mongoose =require("mongoose")
const cors = require("cors")
require('dotenv').config()

const authRoutes = require('./src/routes/authRoutes')
const authenticate = require('./src/middlewere/AuthMiddleware')


const app = express()
app.use(cors())
app.use(express.json());
//https://node5.onrender.com/user/user : domain + endpoints
//http://localhost:3000/test
app.use('/auth',authRoutes);
app.get('/protected',authenticate,(req,res)=>{
    res.json({message: 'access granted to protected route!',user:req.user})
})
const roleRoutes = require('./src/routes/RoleRoutes')
app.use(roleRoutes)
const userRoutes = require('./src/routes/UserRouters');
app.use('/api',userRoutes)
const stateRoute = require('./src/routes/StateRoutes');
app.use(stateRoute)
const cityRoute = require('./src/routes/CityRoutes');
app.use(cityRoute)
const areaRoute = require('./src/routes/AreaRoutes');
app.use(areaRoute)
const vehicleRoute = require('./src/routes/VehicleRoutes');
app.use(vehicleRoute)
const parkingRoutes = require('./src/routes/ParkingRoutes');
app.use(parkingRoutes)
const reservationRoutes = require('./src/routes/ReservationRoutes');
app.use('/reservation', reservationRoutes)
const ownerParkingRoutes = require('./src/routes/OwnerParkingRoutes');
app.use('/owner', ownerParkingRoutes)
const owner = require('./src/routes/OwnerRoutes');
app.use(owner)
const booking = require('./src/routes/BookingRoutes');
app.use(booking)








mongoose.connect('mongodb://localhost:27017/ParKing').then(()=>{
    
console.log('database connected...');

})


const PORT  =3000
app.listen(PORT,()=>{

    console.log('Now server is started at port number',PORT)

})
