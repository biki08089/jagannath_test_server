const RevisedQuotation = require("../model/revisedQuotation");
const Quotation = require("../model/booking");
const revisedQuotation = require("../model/revisedQuotation");

exports.createRevisedQuotation = async (req, res) => {
  try {
    const {
      quotationId,
      discountedPrice,
      discountedPercentage,
      paymentType,
      paidAmount,
      OdometerStart,
      OdometerEnd,
      pendingAmount,
      note,
      isConfirmed,
    } = req.body;

    if (!isConfirmed) {
      const create = await RevisedQuotation.create({
        note,
        quotation: quotationId,
        isConfirmed: false,
      });

      const updateMainquotation = await Quotation.findByIdAndUpdate(
        { _id: quotationId },
        {
          revisedQuotation: create._id,
          bookingStatus: true,
        },
        { new: true }
      );

      return res.status(400).json({
        success: false,
        revisedQuotation: create,
        massage: "Quotation Cancelled..!",
      });
    }

    const create = await RevisedQuotation.create({
      quotation: quotationId,
      discountedPrice,
      discountedPercentage,
      paymentType,
      paidAmount,
      pendingAmount,
      OdometerStart,
      OdometerEnd,
      isConfirmed: true,
    });

    //Store the reference of revised quotation inside the main quotation.
    const updateMainquotation = await Quotation.findByIdAndUpdate(
      { _id: quotationId },
      {
        revisedQuotation: create._id,
        bookingStatus: true,
      },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      revisedQuotation: create,
      massage: "Revised Quotation Created Successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      massage: "Couldn't Create Revised Quotation: Something Went Wrong.",
    });
  }
};

exports.getRevisedQuotationById = async (req, res) => {
  try {
    const id = req.params.id;
    const getQuotationData = await RevisedQuotation.findById({
      _id: id,
    }).populate("quotation");
    if (!getQuotationData) {
      return res.status(404).json({
        success: false,
        massage: "Revised Quotation Couldn't be found",
      });
    }

    res.status(200).json({
      success: true,
      revisedQuotation: getQuotationData,
      massage: "Data Fetched succesfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      massage: "Coudn't fetch the quotation",
    });
  }
};

exports.upDateRevisedQuotationById = async (req, res) => {
  try {
    const {
      discountedPercentage,
      discountedPrice,
      paymentType,
      paidAmount,
      pendingAmount,
      itenaryDetails,
      note,
      isConfirmed,
    } = req.body;
    const id = req.params.id;

    if (!isConfirmed) {
      const updateQuotation = await revisedQuotation.findByIdAndUpdate(
        { _id: id },
        {
          note,
          isConfirmed: isConfirmed,
        },
        { new: true }
      );
      return res.status(400).json({
        success: false,
        revisedData: updateQuotation,
        massage: "Quotation Cancelled Succesfully..",
      });
    }

    const updateQuotation = await revisedQuotation.findByIdAndUpdate(
      { _id: id },
      {
        discountedPrice: discountedPrice,
        discountedPercentage: discountedPercentage,
        paymentType: paymentType,
        paidAmount: paidAmount,
        pendingAmount: pendingAmount,
        itenaryDetails: itenaryDetails,
        isConfirmed: true,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      revisedData: updateQuotation,
      massage: "Revised quotation updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      massgae: "Couldn't updated revised Quotation !",
    });
  }
};

exports.updateJourney = async (req, res) => {
  try {
    const {
      startTime,
      endTime,
      RevisedQuotationId,
      journeyStart,
      journeyFinished,
      OdometerStart,
      OdometerEnd,
    } = req.body;

    const updateJourney = await revisedQuotation.findByIdAndUpdate(
      { _id: RevisedQuotationId },
      {
        startTime: startTime,
        endTime: endTime,
        journeyStart: journeyStart,
        journeyFinished: journeyFinished,
        OdometerStart: OdometerStart,
        OdometerEnd: OdometerEnd,
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      data: updateJourney,
      massage: "Quotation updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      massage: "Couldn't start journey, Something went wrong !",
    });
  }
};
