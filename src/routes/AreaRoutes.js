const routes = require('express').Router();
const areaController = require('../controllers/AreaController');

routes.post('/area', areaController.addArea);
routes.get('/getallcityes', areaController.getAreas);
routes.get("/getareabycity/:cityId",areaController.getAreaBycityId)
module.exports = routes;