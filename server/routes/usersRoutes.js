const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.post("/create-user", userController.createUser);
router.get("/get-all-users", userController.getAllUser);
router.get("/get-all-staffs", userController.getAllStaffUser);
router.get("/get-all-admins", userController.getAllAdminUser);

router.put("/staff-update/:id", userController.updateUser);

// Route to delete a user by their ID
router.delete("/delete/:id", userController.deleteUser);

// Route to forgot user's password
router.post("/forgot-password", userController.forgotPassword);

// Route to change a user's password
router.post("/change-password", userController.changePassword);

// Route to log in a user
router.post("/login", userController.loginUser);

router.get("/getById/:id",userController.getStaffById)

module.exports = router;
