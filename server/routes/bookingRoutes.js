const express = require("express");
const router = express.Router();
const {
  createBooking,
  updateBookingById,
  deleteBookingById,
  getAllbookings,
  getBookingById,
} = require("../controller/bookingController");

router.post("/booking-create", createBooking);
router.put("/booking-update", updateBookingById);
router.delete("/booking-delete", deleteBookingById);
router.get("/booking-getall", getAllbookings);
router.get("/getbooking/:id", getBookingById);

module.exports = router;
