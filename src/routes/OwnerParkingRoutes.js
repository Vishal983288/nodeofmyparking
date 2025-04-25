const routes = require("express").Router();
const parkingController = require("../controllers/OwnerParkingController");

routes.post("/owneraddparking", parkingController.addParking);
routes.get("/ownergetallparkings", parkingController.getAllParkings);
routes.get("/ownergetparking/:ownerId", parkingController.getParkingById);
routes.put("/ownerupdateparking/:id", parkingController.updateParking);
routes.delete("/ownerdeleteparking/:id", parkingController.deleteParking);
routes.get("/ownergetparkings/:ownerId", parkingController.getParkingsByOwnerId);

module.exports = routes;
