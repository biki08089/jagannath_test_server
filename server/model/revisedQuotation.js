const mongoose = require("mongoose");
const sendRevisedEmail = require("../email/sendRevisedEmail");

const revisedItenaryDetailsSchema = new mongoose.Schema({
  place: {
    type: String,
    require: true,
  },
});

const revisedQuotationSchema = new mongoose.Schema(
  {
    quotation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quotation",
      require: true,
    },

    discountedPrice: {
      type: String,
      require: true,
    },
    discountedPercentage: {
      type: String,
      require: true,
    },
    paymentType: {
      type: String,
      enum: ["Advance", "Full"],
      require: true,
    },

    paidAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    pendingAmount: {
      type: Number,
      require: true,
      default: 0,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    journeyStart: {
      type: Boolean,
      default: false,
    },
    journeyFinished: {
      type: Boolean,
      default: false,
    },
    OdometerStart: {
      type: Number,
      default: 0,
    },
    OdometerEnd: {
      type: Number,
      default: 0,
    },
    note: {
      type: String,
    },
    isConfirmed: {
      type: Boolean,
    },
    itenaryDetails: [revisedItenaryDetailsSchema],
  },
  { timestamps: true }
);

revisedQuotationSchema.post("save", async function (doc) {
  try {
    const data = await doc.populate("quotation");
    const mailRes = await sendRevisedEmail(data);
    console.log(mailRes);
  } catch (error) {
    console.log(error);
  }
});

module.exports = mongoose.model("RevisedQuotation", revisedQuotationSchema);
