const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const validateMobileNumber = (phone) => {
  const trimmedContact = phone && phone.trim();
  return trimmedContact && /^[0-9]{10}$/.test(trimmedContact); // Ensure the phone number is exactly 10 digits
};

module.exports = {
  createUser: async (req, res) => {
    try {
      const {
        phone,
        email,
        password,
        userName,
        age,
        gender,
        address,
        role,
        permissions,
        isDeleted,
      } = req.body;

      // Validate phone number
      if (!validateMobileNumber(phone)) {
        return res
          .status(400)
          .json({ error: "Mobile number should be 10 digits." });
      }

      // Check if phone number or email is already registered
      const [existingMobile, existingEmail] = await Promise.all([
        User.findOne({ phone }),
        User.findOne({ email }),
      ]);

      if (existingMobile) {
        return res
          .status(400)
          .json({ error: "Mobile number already registered." });
      }

      if (existingEmail) {
        return res.status(400).json({ error: "Email already registered." });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        phone: phone.trim(),
        userName: userName ? userName.trim() : undefined,
        email: email.trim(),
        age,
        gender,
        address: address ? address.trim() : undefined,
        role,
        password: hashedPassword,
        permissions: role === "admin" ? undefined : permissions,
        isDeleted: isDeleted || false,
      });

      const result = await user.save();

      res.status(200).json({
        message: "User created successfully",
        user: result,
      });
    } catch (err) {
      res.status(500).json({ error: err.message || "Internal Server Error" });
    }
  },
  getStaffById: async (req, res) => {
    try {
      const staffid = await User.findById({ _id: req.params.id });
      if (!staffid) {
        return res.status(404).json({ message: "  staff  id not found" });
      }
      res
        .status(200)
        .json({ message: "staff find succesfully", data: staffid });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllStaffUser: async (req, res) => {
    try {
      const staff = await User.find({ role: "staff" });
      if (staff.length === 0) {
        return res.status(404).json({ message: "Staff data not found" });
      }
      res.status(200).json({
        message: "Successfully retrieved all Staff data",
        data: staff,
      });
    } catch (error) {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  },

  getAllAdminUser: async (req, res) => {
    try {
      const admins = await User.find({ role: "admin" });
      if (admins.length === 0) {
        return res.status(404).json({ message: "Admin data not found" });
      }
      res.status(200).json({
        message: "Successfully retrieved all Admin data",
        data: admins,
      });
    } catch (error) {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  },

  getAllUser: async (req, res) => {
    try {
      const users = await User.find();

      if (users.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }

      res.status(200).json({
        message: "Successfully retrieved all users",
        data: users,
      });
    } catch (error) {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { phone } = req.body;

      if (phone && !validateMobileNumber(phone)) {
        return res
          .status(400)
          .json({ error: "Mobile number should be 10 digits." });
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found for update" });
      }

      res.status(200).json({
        message: "Updated user data successfully",
        user: updatedUser,
      });
    } catch (err) {
      res.status(500).json({ error: err.message || "Internal Server Error" });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const result = await User.deleteOne({ _id: req.params.id });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "User not found for deletion" });
      }

      res.status(200).json({
        message: "User deleted successfully",
        data: result,
      });
    } catch (err) {
      res.status(500).json({ error: err.message || "Internal Server Error" });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { phone, oldPassword, newPassword } = req.body;
      const user = await User.findOne({ phone });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Old password is incorrect" });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();

      res.status(200).json({
        message: "Password updated successfully",
        user,
      });
    } catch (err) {
      res.status(500).json({ error: err.message || "Internal Server Error" });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { phone, email, newPassword, confirmPassword } = req.body;

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match." });
      }

      const user = phone
        ? await User.findOne({ phone })
        : await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ error: "User not found." });
      }

      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update user password
      user.password = hashedNewPassword;
      await user.save();

      res
        .status(200)
        .json({ message: "Password has been reset successfully." });
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { phone, password } = req.body;
      const user = await User.findOne({ phone });

      if (!user) {
        return res.status(400).json({ message: "User not found." });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Password mismatch" });
      }
      // akash uncommeting this
      const token = jwt.sign(
        { userId: user._id, userName: user.userName, phone: user.phone },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      console.log(token);

      res.status(200).json({
        message: "User logged in successfully",
        user,
        token,
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
