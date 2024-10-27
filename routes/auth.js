const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth/user.auth.controller");
const userController = require("../controllers/user/user.controller");
const { protectRoute } = require("../middlewares/auth.mw");
const loginValidationRules = require("../validations/login.vc");

router.route("/login").post(loginValidationRules(), authController.login);

router.route("/register").post(authController.registerUser);

router.route("/logout").post( protectRoute, authController.logout);
router.route('/forgot-password').post(authController.forgotPassword);

// router.route('/users').get(authController.getAllUsers);

// router
//   .route('/users/:id')
//   .get(authController.getUser)
//   .patch(authController.updateUser)
//   .delete(authController.deleteUser);

router.route("/change-password").patch( protectRoute,authController.changePassword);

router.route("/users/:id/password/reset").post(authController.resetPassword);
router
  .route("/profile")
  .get(protectRoute, authController.getUserProfile)
  .patch(
    protectRoute,
    userController.uploadUserImage,
    userController.updateUserProfile
  );

module.exports = router;
