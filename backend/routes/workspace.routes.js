const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { userAuth } = require("../middlewares/user.auth");
const {
  createWorkspace,
  deleteWorkspace,
  getAllWorkspace,
  editWorkspace,
} = require("../controllers/workspace.controller");


router.post("/create", [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").optional(),
], userAuth,createWorkspace);

router.get("/all",userAuth,getAllWorkspace);

// router.delete("/delete-workspace/:id", [], userAuth, deleteWorkspace);
// router.get("/get-all-workspace", [], userAuth, getAllWorkspace);
// router.put("/edit-workspace/:id", [], userAuth, editWorkspace);

module.exports = router;
