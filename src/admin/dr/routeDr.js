const express = require("express");
const router = express.Router();
const {
  getAllDr,
  getDr,
  deleteDr,
  updateDr,
  signup,
  addSpecialties,
  getAllDrSameSpec,
  changeAvailable,
  getNearMe,
  getAllDrByRating,
  getAllDrByGender,
  getAllDrByCost
} = require("./controllerDr");
const { verifyToken, checkUserDuplicate } = require("../auth/verifyToken");
const { check, body, param } = require("express-validator");


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
router.get(
    "/getNearMe",
    verifyToken(["user", "hf", "dr", "superadmin"]),
    getNearMe
  );
router.post("/getAllDrSameSpec", getAllDrSameSpec);
router.post("/getAllDrByRating", getAllDrByRating);
router.post("/getAllDrByGender", getAllDrByGender);
router.post("/getAllDrByCost", getAllDrByCost);

router.get("/:id", getDr);
router.post(
  "/changeAvailable",
  verifyToken(["hf", "dr", "superadmin"]),
  changeAvailable
);
router.get("/", getAllDr);

router.post(
  "/addSpecialties",
  check("name").not().isEmpty().withMessage("name is required"),
  verifyToken(["dr", "superadmin"]),
  addSpecialties
);
router.put("/:id", verifyToken(["dr", "superadmin"]), updateDr);
router.delete("/:id", verifyToken(["dr", "superadmin"]), deleteDr);
// ,verifyToken
// ,verifyToken
// ,verifyToken
// ,verifyToken

module.exports = router;
