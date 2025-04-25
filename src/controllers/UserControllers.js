const userModel = require('../models/UserModel')
const bcrypt = require('bcrypt')
const mailUtil = require('../utils/MailUtils')
const jwt = require('jsonwebtoken')
const secret = 'secret'

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email and populate roleId
        const foundUser = await userModel.findOne({ email }).populate("roleId");
        console.log("Found User:", foundUser);

        if (!foundUser) {
            return res.status(404).json({ message: "Email not found." });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, foundUser.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Return only necessary user data (Exclude password)
        return res.status(200).json({
            message: "Login success",
            data: {
                _id: foundUser._id, 
                email: foundUser.email,
                roleId: foundUser.roleId, // Role information
                firstname: foundUser.firstname,
                lastname: foundUser.lastname
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Server error. Please try again." });
    }
};

module.exports = { loginUser };


const signUp = async (req, res) => {


    try {
            const salt = bcrypt.genSaltSync(10);
            const hashedpassword = bcrypt.hashSync(req.body.password,salt)
            req.body.password = hashedpassword;
            
            console.log(req.body)
        const createUser = await userModel.create(req.body);
        // await mailUtil.sendingmail(createUser.email,"welcome to My parking",`Hellow ${createUser.firstname}`)

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
    console.log('Fetching all users..')
    try{

    const users = await userModel.find().populate("roleId");
    console.log(users);
    res.json({
        message: "User fetched successfully",
        data: users
    });
} catch(err){
        res.status(500).json({message:'Server error',error:err})
}
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
    try {
        const foundUser = await userModel.findById(req.params.id);

        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'User fetched successfully',
            data: foundUser
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error while fetching user' });
    }
};

const forgotPassword = async (req, res) => {
    const email = req.body.email;
    const foundUser = await userModel.findOne({ email: email });
  
    if (foundUser) {
      const token = jwt.sign(foundUser.toObject(), secret);
      console.log(token);
      const url = `http://localhost:3000/resetpassword/${token}`;
      const mailContent = `<html>
                            <a href ="${url}">rest password</a>
                            </html>`;
     
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
    const token = req.body.token;
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