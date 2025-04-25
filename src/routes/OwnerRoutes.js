const express = require("express");
const {
    signUp,
    loginUser,
    getAllOwners,
    getOwnerById,
    updateOwner,
    deleteOwner,
    forgotPassword,
    resetPassword
} = require("../controllers/OwnerController");

const router = express.Router();

router.post("/ownersignup", signUp); 
router.post("/ownerlogin", loginUser); 
router.get("/getallowners", getAllOwners); 
router.get("/getownerbyid/:ownerId", getOwnerById); 
router.put("/updateownerbyid/:ownerid", updateOwner); 
router.delete("/deleteowner/:ownerid", deleteOwner); 
router.post("/ownerforgotpassword", forgotPassword);
router.post("/ownerresetpassword", resetPassword); 

module.exports = router;
