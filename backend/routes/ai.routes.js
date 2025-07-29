const express = require("express");
const router = express.Router();
const {userAuth} = require("../middlewares/user.auth")
const  {askAi}  = require("../controllers/ai.conroller");

router.post("/ask-ai",userAuth,askAi);


module.exports = router;
 