//add city
//display city
const cityModel = require("../models/CityModel");

const addCity = async (req, res) => {
  try {
    const savedCity = await cityModel.create(req.body);
    res.status(201).json({
      message: "City added successfully",
      data: savedCity,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllCityes = async (req, res) => {
  try {
    const cityes = await cityModel.find().populate("stateId");
    res.status(200).json({
      message: "All cityes are here..",
      data: cityes,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
const getCityByStateId = async (req, res) => {
  try {
    const cities = await cityModel.find({ stateId: req.params.stateId });
    res.status(200).json({
      message: "city found",
      data: cities,
    });
  } catch (err) {
    res.status(500).json({
      message: "city  not found",
    });
  }
};

module.exports = { addCity, getAllCityes,getCityByStateId };