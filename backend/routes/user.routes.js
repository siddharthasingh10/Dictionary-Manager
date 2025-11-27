const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { getMe, login, signup, logout,getUser,getFriends ,addFriend} = require("../controllers/user.controllers");
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
router.get("/get-friends/:id",userAuth, getFriends);
router.get("/me",userAuth,getMe);
router.post('/add-friend', userAuth, addFriend);

module.exports = router;
