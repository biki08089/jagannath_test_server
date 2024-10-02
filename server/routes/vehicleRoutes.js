const express = require("express");
const router = express.Router();

const {
  createVehicle,
  updateVehicleById,
} = require("../controller/vehicleController");

router.post("/create-vehicle", createVehicle);
router.put("/update-vehicle", updateVehicleById);

module.exports = router;
