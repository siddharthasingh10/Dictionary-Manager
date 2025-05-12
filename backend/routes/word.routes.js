const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const { userAuth } = require('../middlewares/user.auth');
const { deleteWord,createWord,wordsByWorkspceId,toggleFavorite,updateWord} = require('../controllers/word.controller');

router.post('/create', [
    body('word').notEmpty().withMessage('word is required'),
  
], userAuth, createWord);

router.get('/get/:workspaceId', userAuth, wordsByWorkspceId);
router.delete('/delete/:wordId', userAuth,deleteWord );

router.put('/edit/:wordId', [
    body('word').notEmpty().withMessage('word is required'),
], userAuth, updateWord);
router.patch('/favorite/:wordId', userAuth, toggleFavorite);

module.exports = router;