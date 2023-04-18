const express = require("express");
const router = express.Router();
const {
  updateBooking,
  deleteBookingAv,
  getBookingAv,
  addbookingAv,
  getAllBookingAv,
  addBooking,
  getAllBooking,
  getBooking,
  getAllBookingAvByDr,
  getAllBookingByUser,
  getAllBookingAvbyDate,
  getAllBookingByDr,
} = require("./controllerBooking");

const { verifyToken, checkUserDuplicate } = require("../auth/verifyToken");
const { check, body, param } = require("express-validator");

router.post(
  "/addbookingAv",
  verifyToken(["hf", "dr", "superadmin"]),
  addbookingAv
);
router.post(
  "/addbooking",
  verifyToken(["hf", "dr", "user", "superadmin"]),
  addBooking
);
router.get("/booked", verifyToken(["superadmin"]), getAllBooking);
router.get("/", verifyToken(["superadmin"]), getAllBookingAv);
router.post("/dr", getAllBookingAvByDr);
router.post("/date/dr", getAllBookingAvbyDate);

router.get(
  "/user/:id",
  verifyToken(["user", "hf", "dr", "superadmin"]),
  getAllBookingByUser
);
router.get(
  "/dr/:id",
  verifyToken(["user", "hf", "dr", "superadmin"]),
  getAllBookingByDr
);

router.put("/:id", verifyToken(["hf", "dr", "superadmin"]), updateBooking);
router.delete("/:id", verifyToken(["hf", "dr", "superadmin"]), deleteBookingAv);
router.get("/:id", getBookingAv);
router.get("/booked/:id", getBooking);
// ,verifyToken
// ,verifyToken
// ,verifyToken
// ,verifyToken

module.exports = router;
