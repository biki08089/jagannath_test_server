// const customerDetails = require("../model/booking");
const Quotation = require("../model/booking");

const validateMobileNumber = (phone) => {
  const trimmedContact = phone && phone.trim();
  return trimmedContact && /^[0-9]{10}$/.test(trimmedContact); // Ensure the phone number is exactly 10 digits
};

//Create Booking...
exports.createBooking = async (req, res) => {
  try {
    const {
      name,
      age,
      phone,
      email,
      from,
      to,
      startDate,
      endDate,
      price,
      GST,
      itenaryDetails,
      termsAndConditions,
    } = req.body;

    // console.log(req.body);

    // Validate phone number
    if (!validateMobileNumber(phone)) {
      return res
        .status(400)
        .json({ success: false, error: "Mobile number should be 10 digits." });
    }

    //Check if the same customer already exists..
    const findCustomerWithPhone = await Quotation.findOne({
      "customerDetails.phone": phone,
    }).populate("revisedQuotation");
    const findCustomerWithEmail = await Quotation.findOne({
      "customerDetails.email": email,
    }).populate("revisedQuotation");

    // console.log("*****phone*****");
    // console.log(findCustomerWithPhone);
    // console.log("****email*****");
    // console.log(findCustomerWithEmail);

    // //Check for the non confirmation bookings...
    // if (findCustomerWithPhone) {
    //   if (!findCustomerWithPhone?.revisedQuotation) {
    //     return res.status(400).json({
    //       success: false,
    //       massage: `We have got your quotation already with this phone number: ${phone} Waiting for the confimation.Thank you`,
    //     });
    //   }
    // }

    // //Check for the non confirmation bookings...
    // if (findCustomerWithEmail) {
    //   if (!findCustomerWithEmail?.revisedQuotation) {
    //     return res.status(400).json({
    //       success: false,
    //       massage: `We have got your quotation already with this email: ${email} Waiting for the confimation.Thank you`,
    //     });
    //   }
    // }

    //Check the booking status confirmation while creating a booking
    if (findCustomerWithPhone?.revisedQuotation?.isConfirmed) {
      return res.status(400).json({
        success: false,
        massage: `Customer already has a quotation confirmed with us, with the same number: ${phone}. Customer can creat a fresh booking only after the previous booking is completed or cancelled. Thank you. `,
      });
    }
    if (findCustomerWithEmail?.revisedQuotation?.isConfirmed) {
      return res.status(400).json({
        success: false,
        massage: `Customer already has a quotation confirmed with us, with the same email: ${email}. Customer can creat a fresh booking only after the previous booking is completed or cancelled. Thank you. `,
      });
    }

    const booking = await Quotation.create({
      bookingStatus: false,
      customerDetails: {
        name,
        age,
        phone,
        email,
        from,
        to,
        startDate,
        endDate,
      },
      priceDetails: { price, GST },
      itenaryDetails: itenaryDetails,
      termsAndConditions: termsAndConditions,
    });

    return res.status(200).json({
      success: true,
      quotation: booking,
      massage: "Quotation Created Successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      massage: "Couldn't create Quotation",
    });
  }
};

//Update Booking By ID
exports.updateBookingById = async (req, res) => {
  try {
    //Accessing the details to update..
    const {
      name,
      age,
      phone,
      email,
      from,
      to,
      startDate,
      endDate,
      price,
      GST,
      itenaryDetails,
    } = req.body;

    const { quotationId } = req.body;

    // Validate phone number
    if (!validateMobileNumber(phone)) {
      return res
        .status(400)
        .json({ success: false, error: "Mobile number should be 10 digits." });
    }

    const update = await Quotation.findByIdAndUpdate(
      { _id: quotationId },
      {
        bookingStatus: false,
        customerDetails: {
          name: name,
          age: age,
          phone: phone,
          email: email,
          from: from,
          to: to,
          startDate: startDate,
          endDate: endDate,
        },
        priceDetails: { price: price, GST: GST },
        itenaryDetails: itenaryDetails,
      },

      { new: true }
    );

    return res.status(201).json({
      success: true,
      quotation: update,
      massage: "Quotation updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      massage: "Error updating Quotation",
    });
  }
};

//Delete booking by particular Id..
exports.deleteBookingById = async (req, res) => {
  try {
    const { quotationId } = req.body;
    const deleteBooking = await Quotation.findByIdAndDelete(
      { _id: quotationId },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      quotation: deleteBooking,
      massage: "deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      massage: "Couldn't delete Quotation",
    });
  }
};

//All bookings are fetched.
exports.getAllbookings = async (req, res) => {
  try {
    const getBookings = await Quotation.find()
      .sort({ createdAt: -1 })
      .populate("revisedQuotation")
      .populate("vehicle");

    return res.status(200).json({
      success: true,
      quotation: getBookings,
      massage: "ALL Quotation fetched successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      massage: "Couldn't fetch Quotation !",
    });
  }
};

//Get booking booking date wise...
exports.getFilteredbookings = async (req, res) => {
  try {
    const getBookings = await Quotation.find()
      .populate("revisedQuotation")
      .populate("vehicle");
    return res.status(200).json({
      success: true,
      quotation: getBookings,
      massage: "ALL Quotation fetched successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      massage: "Couldn't fetch Quotation !",
    });
  }
};

//Here fetch a particular booking by Id
exports.getBookingById = async (req, res) => {
  try {
    const id = req.params.id;
    const findDataById = await Quotation.findById({ _id: id })
      .populate("revisedQuotation")
      .populate("vehicle");
    return res.status(200).json({
      success: true,
      quotation: findDataById,
      massage: "Booking Loaded Successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      massage: "Couldn't fetch requested Booking",
    });
  }
};
