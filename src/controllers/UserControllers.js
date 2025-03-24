const userModel = require('../models/UserModel')
const bcrypt = require('bcrypt')
const mailUtil = require('../utils/MailUtils')


    const loginUser = async (req,res)=>{

        const email = req.body.email;
        const password = req.body.password;


        const foundUserFromEmail = await userModel.findOne({email: email}).populate("roleId")
        console.log(foundUserFromEmail);

        if(foundUserFromEmail != null){

            const isMatch = bcrypt.compareSync(password, foundUserFromEmail.password);

            if(isMatch== true){
                res.status(200).json({
                        
                    message:'login success',
                    data:{
                        email:foundUserFromEmail.email,
                        password:foundUserFromEmail.password
                    }
                  
                })
            }else{
                res.status(404).json({
                    message:'invalid cred'
                })
            }
        }else{
            res.status(404).json({
                message:'Email not found..'
            })
        }
    }

const signUp = async (req, res) => {


    try {
            const salt = bcrypt.genSaltSync(10);
            const hashedpassword = bcrypt.hashSync(req.body.password,salt)
            req.body.password = hashedpassword;
            
            console.log(req.body)
        const createUser = await userModel.create(req.body);
        await mailUtil.sendingmail(createUser.email,"welcome to My parking",`Hellow ${createUser.firstname}`)

        res.status(201).json({
            message: "user created..",
            data: createUser

        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "error",
            data: err
        });
    }
}



const getAllUsers = async (req, res) => {

    const users = await userModel.find().populate("roleId");
    console.log(users);
    res.json({
        message: "User fetched successfully",
        data: users
    });
}

const addUser = async (req, res) => {

    const savedUser = await userModel.create(req.body)

    res.json({
        message: 'User created... Post is called',
        data: savedUser
    });
}
const deleteUser = async (req, res) => {

    const deletedUser = await userModel.findByIdAndDelete(req.params.id)

    res.json({
        message: 'User deleted successfully...',
        data: deletedUser
    });
}
const getUserById = async (req, res) => {

    const foundUser = await userModel.findById(req.params.id)

    res.json({
        message: 'User fetched...',
        data: foundUser
    });
}

module.exports = {
    getAllUsers, addUser, deleteUser, getUserById,loginUser,signUp
}