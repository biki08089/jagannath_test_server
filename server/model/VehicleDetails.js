const mongoose = require("mongoose");
const revisedQuotation = require("./revisedQuotation");

const VehicleDetailsSchema = new mongoose.Schema(
  {
    quotation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quotation",
      require: true,
    },
    vehicleName: {
      type: String,
      require: true,
    },
    vehicleNumber: {
      type: String,
      require: true,
    },
    driverName: {
      type: String,
      require: true,
    },
    driverPhoneNumber: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("vehicle", VehicleDetailsSchema);
