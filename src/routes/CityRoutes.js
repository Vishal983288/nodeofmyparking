const routes = require('express').Router()

const cityController = require('../controllers/CityController')


routes.post('/addcity',cityController.addCity)
routes.get('/getallcityes',cityController.getAllCityes)
routes.get("/getcitybystate/:stateId",cityController.getCityByStateId)

module.exports=routes
