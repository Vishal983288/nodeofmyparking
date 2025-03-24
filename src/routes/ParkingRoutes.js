const routes = require("express").Router()

const parkingController = require("../controllers/ParkingController")

routes.post('/addparking',parkingController.addParking)
routes.get('/getallparkings',parkingController.getAllParkings)

module.exports=routes