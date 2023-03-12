const express = require("express");
const router = express.Router();
const { signup, signin,getOtp,verifyOTP,forgetPassword,refreshToken } = require("./authController");
const { checkUserDuplicate } = require("./verifySignup");
const { check, body } = require("express-validator");
router.post(
  "/signup",
  check("phoneNumber")
    .not()
    .isEmpty()
    .isLength({ min: 6, max: 50 })
    .withMessage("phone number is required"),
  body("password").not().isEmpty().isLength({ min: 6, max: 23 }),
  check("dob").not().isEmpty().isDate(),
  check("gender").not().isEmpty(),
  signup
);
router.post(
  "/signin",
  check("phoneNumber")
    .not()
    .isEmpty()
    .isLength({ min: 6, max: 50 })
    .withMessage("phoneNumber is required"),
  body("password").not().isEmpty().isLength({ min: 6, max: 23 }),
  signin
);
router.post(
  "/otp",
  getOtp
);
router.post(
  "/verifyOTP",
  verifyOTP
);
router.post(
  "/forgetpassword",
  forgetPassword
);
router.post(
  "/refreshToken",
  refreshToken
);
module.exports = router;
