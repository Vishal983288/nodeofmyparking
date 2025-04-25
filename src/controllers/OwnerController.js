const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OwnerModel = require("../models/OwnerrModel");
const mailUtil = require("../utils/MailUtils");
const secret = "secret";

//  Owner Signup
const signUp = async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hashedPassword;

        console.log(req.body);
        const createOwner = (await OwnerModel.create(req.body));

        // await mailUtil.sendingmail(createOwner.email, "Welcome to My Parking", `Hello ${createOwner.firstname}`);

        res.status(201).json({
            message: "Owner account created successfully.",
            data: createOwner
        });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({
            message: "Error creating owner account",
            error: err
        });
    }
};

//  Owner Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const foundOwner = await OwnerModel.findOne({ email }).populate("roleId");
        console.log("Found Owner:", foundOwner);

        if (!foundOwner) {
            return res.status(404).json({ message: "Email not found." });
        }

        const isMatch = await bcrypt.compare(password, foundOwner.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        return res.status(200).json({
            message: "Login successful",
            data: {
              _id: foundOwner._id,
              roleId: foundOwner.roleId?._id || foundOwner.roleId, // handle both populated or plain ObjectId
              email: foundOwner.email,
              firstname: foundOwner.firstname,
              lastname: foundOwner.lastname,
              businessName: foundOwner.businessName
            }
          });
          
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Server error. Please try again." });
    }
};

//  Get all Owners
const getAllOwners = async (req, res) => {
    console.log("Fetching all owners...");
    try {
        const owners = await OwnerModel.find().populate("roleId");
        console.log(owners);
        res.json({
            message: "Owners fetched successfully",
            data: owners
        });
    } catch (err) {
        console.error("Error fetching owners:", err);
        res.status(500).json({ message: "Server error", error: err });
    }
};

//  Get Owner by ID
const getOwnerById = async (req, res) => {
    try {
        const foundOwner = await OwnerModel.findById(req.params.ownerId);

        if (!foundOwner) {
            return res.status(404).json({ message: "Owner not found" });
        }

        res.json({
            message: "Owner fetched successfully",
            data: foundOwner
        });
    } catch (error) {
        console.error("Error fetching owner:", error);
        res.status(500).json({ message: "Server error while fetching owner" });
    }
};

//  Update Owner
const updateOwner = async (req, res) => {
    try {
        const updatedOwner = await OwnerModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedOwner) {
            return res.status(404).json({ message: "Owner not found" });
        }

        res.json({
            message: "Owner updated successfully",
            data: updatedOwner
        });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ message: "Error updating owner", error: err });
    }
};

//  Delete Owner
const deleteOwner = async (req, res) => {
    try {
        const deletedOwner = await OwnerModel.findByIdAndDelete(req.params.id);

        if (!deletedOwner) {
            return res.status(404).json({ message: "Owner not found" });
        }

        res.json({
            message: "Owner deleted successfully",
            data: deletedOwner
        });
    } catch (error) {
        console.error("Error deleting owner:", error);
        res.status(500).json({ message: "Server error while deleting owner" });
    }
};

//  Forgot Password
const forgotPassword = async (req, res) => {
    const email = req.body.email;
    const foundOwner = await OwnerModel.findOne({ email });

    if (foundOwner) {
        const token = jwt.sign({ _id: foundOwner._id }, secret, { expiresIn: "1h" });
        console.log("Reset Token:", token);
        const url = `http://localhost:5173/resetpassword/${token}`;

        const mailContent = `<html>
                                <a href="${url}">Reset Password</a>
                             </html>`;

        await mailUtil.sendingMail(foundOwner.email, "Reset Password", mailContent);
        res.json({
            message: "Reset password link sent to your email."
        });
    } else {
        res.status(404).json({
            message: "Owner not found. Please register first."
        });
    }
};

//  Reset Password
const resetPassword = async (req, res) => {
    try {
        const token = req.body.token;
        const newPassword = req.body.password;

        const decodedToken = jwt.verify(token, secret);
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(newPassword, salt);

        const updatedOwner = await OwnerModel.findByIdAndUpdate(decodedToken._id, { password: hashedPassword });

        if (!updatedOwner) {
            return res.status(404).json({ message: "Owner not found" });
        }

        res.json({
            message: "Password updated successfully."
        });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Server error while resetting password." });
    }
};

module.exports = {
    signUp,
    loginUser,
    getAllOwners,
    getOwnerById,
    updateOwner,
    deleteOwner,
    forgotPassword,
    resetPassword
};
