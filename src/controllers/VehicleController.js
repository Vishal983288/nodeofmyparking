const vehicleModel = require("../models/VehicleModel")

const addVehicle = async(req,res)=>{
    try{

        const savedVehicle = await vehicleModel.create(req.body)
        res.status(201).json({
            message:"vehicle created successfully..",
            data:savedVehicle
        })
    }catch(err){
        res.status(500).json({message:err.message})

    }
}

const getAllVehicles=async(req,res)=>{

    try{
            const vehicles= await vehicleModel.find().populate("userId")
            if(vehicles.length === 0){
                res.status(404).json({message:"no vehicle found"})

            }else{
                res.status(200).json({
                    message:"vehicle found successfully",
                    data:vehicles
                })
            }
    }catch(err){
            res.status(500).json({message:err.message})
    }
} 
module.exports={addVehicle,getAllVehicles}