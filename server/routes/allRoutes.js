const express = require("express");
const router = express.Router();
const usersRoutes = require("./usersRoutes");
const bookingRoute = require("./bookingRoutes");
const revisedRoute = require("./revisedRoutes");
const vehicleRoute = require("./vehicleRoutes");

router.use("/user", usersRoutes);
router.use("/booking", bookingRoute);
router.use("/revise", revisedRoute);
router.use("/vehicle", vehicleRoute);

module.exports = router;
