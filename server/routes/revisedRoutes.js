const express = require("express");
const router = express.Router();
const {
  createRevisedQuotation,
  getRevisedQuotationById,
  upDateRevisedQuotationById,
  updateJourney,
} = require("../controller/revisedQuotationController");

router.post("/revised-quotation", createRevisedQuotation);
router.get("/get-revised-quotation/:id", getRevisedQuotationById);
router.put("/revised-update/:id", upDateRevisedQuotationById);
router.patch("/time-update", updateJourney);

module.exports = router;
