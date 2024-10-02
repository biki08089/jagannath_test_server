const mongoose = require("mongoose");

const permissionsSchema = new mongoose.Schema(
  {
    dashboard: { type: Boolean },
    staff: { type: Boolean, required: true },
    quotations: { type: Boolean, required: true },
    ledger: { type: Boolean, required: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    userName: { type: String },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["male", "female"] },
    address: { type: String },
    role: { type: String, enum: ["admin", "staff"] },
    password: { type: String, required: true },
    permissions: permissionsSchema,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (this.role === "admin") {
    this.permissions = {
      dashboard: true,
      staff: true,
      quotations: true,
      ledger: true,
    };
  } else if (this.role === "staff") {
    this.permissions = {
      dashboard: true,
      staff: false,
      quotations: false,
      ledger: false,
    };
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
