const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { login, signup, logout,getUser } = require("../controllers/user.controllers");
const {userAuth} = require("../middlewares/user.auth")

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email address."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
  ],
  login
);
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Please enter a valid email address."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
  ],
  signup
);
router.post("/logout", userAuth,logout);
router.get("/get/:id",userAuth, getUser);

module.exports = router;
