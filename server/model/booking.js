const mongoose = require("mongoose");
require("dotenv").config();
const sendMail = require("../email/sendMail");

const customerDetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },

  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

const priceSchema = new mongoose.Schema({
  price: {
    type: Number,
    require: true,
  },
  GST: {
    type: String,
    require: true,
  },
});

const itenaryDetailsSchema = new mongoose.Schema({
  place: {
    type: String,
    require: true,
  },
});

const termsAndConditionsSchema = new mongoose.Schema({
  heading: {
    type: String,
    require: true,
  },
  paragraph: [
    {
      type: String,
      require: true,
    },
  ],
});

const bookingDetailSchema = new mongoose.Schema(
  {
    bookingStatus: {
      type: Boolean,
    },
    customerDetails: customerDetailsSchema,
    priceDetails: priceSchema,
    itenaryDetails: [itenaryDetailsSchema],
    termsAndConditions: [termsAndConditionsSchema],
    revisedQuotation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RevisedQuotation",
      require: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vehicle",
      require: true,
    },
  },
  { timestamps: true }
);

//Send mail after booking created..
bookingDetailSchema.post("save", async function (doc, res) {
  try {
    const mailRes = await sendMail(doc);
    console.log(mailRes);
  } catch (error) {
    console.log(error);
  }
});

module.exports = mongoose.model("Quotation", bookingDetailSchema);
