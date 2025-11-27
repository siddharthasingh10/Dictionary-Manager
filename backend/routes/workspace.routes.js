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
  addCollaborators,
  getCollaboratedWorkspaces,
  saveWorkspace,
  likeOrDislikeWorkspace,
  getAllSavedWorkspaces
} = require("../controllers/workspace.controller");

// CREATE
router.post("/create", [
  body("title").notEmpty(),
  body("description").optional(),
], userAuth, createWorkspace);

// COLLABORATORS
router.post("/add-collaborators", userAuth, addCollaborators);
router.get("/collaborated", userAuth, getCollaboratedWorkspaces);

// FETCH ALL
router.get("/all", userAuth, getAllWorkspace);

// USER WORKSPACES
router.get("/user/:userId", userAuth, getAllWorkspacesByUserId);

// CRUD BY ID
router.get("/view/:workspaceId", userAuth, getWorkspaceById);
router.put("/edit/:workspaceId", userAuth, editWorkspace);
router.delete("/delete/:workspaceId", userAuth, deleteWorkspace);

// LIKE / DISLIKE
router.post("/like/:workspaceId", userAuth, (req, res) =>
  likeOrDislikeWorkspace(req, res, "like")
);

router.post("/dislike/:workspaceId", userAuth, (req, res) =>
  likeOrDislikeWorkspace(req, res, "dislike")
);

// SAVE / UNSAVE
router.post("/save/:workspaceId", userAuth, saveWorkspace);

// SAVED WORKSPACES
router.get("/saved/:userId", userAuth, getAllSavedWorkspaces);

module.exports = router;






// const express = require("express");
// const router = express.Router();
// const { body } = require("express-validator");
// const { userAuth } = require("../middlewares/user.auth");
// const {
//   createWorkspace,
//   deleteWorkspace,
//   getAllWorkspace,
//   editWorkspace,
//   getWorkspaceById,
//   getAllWorkspacesByUserId,
//   addCollaborators,getCollaboratedWorkspaces,
//   saveWorkspace,
//   likeOrDislikeWorkspace,
//   getAllSavedWorkspaces
// } = require("../controllers/workspace.controller");




// router.post("/create", [
//     body("title").notEmpty().withMessage("Title is required"),
//     body("description").optional(),
// ], userAuth,createWorkspace);
// router.post("/add-collaborators",userAuth,addCollaborators);
// router.get("/collaborated",userAuth,getCollaboratedWorkspaces);  
// router.get("/all",userAuth,getAllWorkspace);
// router.get("/all/:userId",userAuth,getAllWorkspacesByUserId);
// router.delete("/delete/:workspaceId", userAuth, deleteWorkspace);
// router.get("/:workspaceId", userAuth, getWorkspaceById);
// router.put("/edit/:workspaceId", [], userAuth, editWorkspace);
// router.post('/:workspaceId/:action', userAuth, likeOrDislikeWorkspace);
// router.get('/:userId/allsaved',userAuth,getAllSavedWorkspaces);
// router.post('/:workspaceId/save', userAuth, saveWorkspace);

// module.exports = router;
