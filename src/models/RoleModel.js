const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const roleSchema =new Schema({
    name:{
        type:String
    
    },
    description:{
        enum:["admin","user","parkingowner"],
        type:String
    }

})

module.exports =mongoose.model("roles",roleSchema)