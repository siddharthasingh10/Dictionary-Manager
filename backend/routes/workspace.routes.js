const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { userAuth } = require("../middlewares/user.auth");
const {
  createWorkspace,
  deleteWorkspace,
  getAllWorkspace,
  editWorkspace,
  getWorkspaceById,
  getAllWorkspacesByUserId,
  addCollaborators,getCollaboratedWorkspaces,
  saveWorkspace,
  likeOrDislikeWorkspace,
  getAllSavedWorkspaces
} = require("../controllers/workspace.controller");


router.post("/create", [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").optional(),
], userAuth,createWorkspace);


router.post("/add-collaborators",userAuth,addCollaborators);
router.get("/collaborated",userAuth,getCollaboratedWorkspaces);  
router.get("/all",userAuth,getAllWorkspace);
router.get("/all/:userId",userAuth,getAllWorkspacesByUserId);
router.delete("/delete/:workspaceId", userAuth, deleteWorkspace);
router.get("/:workspaceId", userAuth, getWorkspaceById);
router.put("/edit/:workspaceId", [], userAuth, editWorkspace);
router.post('/:workspaceId/:action', userAuth, likeOrDislikeWorkspace);
router.get('/:userId/allsaved',userAuth,getAllSavedWorkspaces);
router.post('/:workspaceId/save', userAuth, saveWorkspace);

module.exports = router;
