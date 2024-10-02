const vehicle = require("../model/VehicleDetails");
const revisedQuotation = require("../model/revisedQuotation");
const Quotation = require("../model/booking");

// const validateMobileNumber = (phone) => {
//   const trimmedContact = phone && phone.trim();
//   return trimmedContact && /^[0-9]{10}$/.test(trimmedContact); // Ensure the phone number is exactly 10 digits
// };

exports.createVehicle = async (req, res) => {
  try {
    const {
      quotation,
      vehicleName,
      vehicleNumber,
      driverName,
      driverPhoneNumber,
    } = req.body;
    console.log(req.body);
    // Validate phone number
    // if (!validateMobileNumber(driverPhoneNumber)) {
    //   return res
    //     .status(400)
    //     .json({ success: false, error: "Mobile number should be 10 digits." });
    // }

    //Find revised quotaion and check status.
    // const checkRevisedData = await revisedQuotation.findById({
    //   _id: revisedQuotationId,
    // });

    // if (!checkRevisedData.isConfirmed) {
    //   return res.status(400).json({
    //     success: false,
    //     massage: "Quotation Cancelled...",
    //   });
    // }

    const createVehicle = await vehicle.create({
      quotation,
      vehicleName,
      vehicleNumber,
      driverName,
      driverPhoneNumber,
    });

    //store the vehicle reference inside the mainQoutation..
    const updateMainQuotation = await Quotation.findByIdAndUpdate(
      { _id: quotation },
      {
        vehicle: createVehicle._id,
      },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      vehicle: createVehicle,
      massage: "Vehicle created",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      massage: "Couldn't process futher.Something went wrong.",
    });
  }
};

exports.updateVehicleById = async (req, res) => {
  try {
    const { _id, vehicleName, vehicleNumber, driverName, driverPhoneNumber } =
      req.body;

    // Validate phone number
    // if (!validateMobileNumber(driverPhoneNumber)) {
    //   return res
    //     .status(400)
    //     .json({ success: false, error: "Mobile number should be 10 digits." });
    // }

    const updateVehicle = await vehicle.findByIdAndUpdate(
      { _id: _id },
      {
        vehicleName: vehicleName,
        vehicleNumber: vehicleNumber,
        driverName: driverName,
        driverPhoneNumber: driverPhoneNumber,
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      vehicle: updateVehicle,
      massage: "Vehicle updated Successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      massage: "Couldn't update vehicle. Something went wrong !",
    });
  }
};
