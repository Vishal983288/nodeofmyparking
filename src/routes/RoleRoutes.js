const routes =require('express').Router()
const roleController = require('../controllers/RoleControllers')
routes.get('/roles',roleController.getAllRoles)
routes.post('/role',roleController.addRole)
routes.delete('/role/:id',roleController.deleteRole)
routes.get('/roles/:id',roleController.getRoleById)



module.exports =routes