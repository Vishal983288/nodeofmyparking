const userModel = require('../models/UserModel')
const bcrypt = require('bcrypt')
const mailUtil = require('../utils/MailUtils')
const jwt = require('jsonwebtoken')
const secret = 'secret'


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
                        password:foundUserFromEmail.password,
                        roleId: foundUserFromEmail.roleId
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
const forgotPassword = async (req, res) => {
    const email = req.body.email;
    const foundUser = await userModel.findOne({ email: email });
  
    if (foundUser) {
      const token = jwt.sign(foundUser.toObject(), secret);
      console.log(token);
      const url = `http://localhost:5173/resetpassword/${token}`;
      const mailContent = `<html>
                            <a href ="${url}">rest password</a>
                            </html>`;
      //email...
      await mailUtil.sendingMail(foundUser.email, "reset password", mailContent);
      res.json({
        message: "reset password link sent to mail.",
      });
    } else {
      res.json({
        message: "user not found register first..",
      });
    }
  };
  
  const resetpassword = async (req, res) => {
    const token = req.body.token; //decode --> email | id
    const newPassword = req.body.password;
  
    const userFromToken = jwt.verify(token, secret);
    //object -->email,id..
    //password encrypt...
    const salt = bcrypt.genSaltSync(10);
    const hashedPasseord = bcrypt.hashSync(newPassword,salt);
  
    const updatedUser = await userModel.findByIdAndUpdate(userFromToken._id, {
      password: hashedPasseord,
    });
    res.json({
      message: "password updated successfully..",
    });
  };

module.exports = {
    getAllUsers, addUser, deleteUser, getUserById,loginUser,signUp,forgotPassword,resetpassword
}