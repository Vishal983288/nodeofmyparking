const mongoose =require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema({

    firstname:{
        type:String
    },
    lastname:{
        type:String
    },
    age:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    phonenumber:{
        type:String
    },
    roleId:{
        type:Schema.Types.ObjectId,
        ref:"roles"
    },
   

})
module.exports =mongoose.model('users',userSchema)