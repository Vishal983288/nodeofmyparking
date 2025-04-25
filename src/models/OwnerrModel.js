const mongoose = require("mongoose");

const OwnerSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    businessName: { type: String, required: true },
    
    roleId: [{ type: mongoose.Schema.Types.ObjectId, ref: "roles" }],

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("owner", OwnerSchema);
