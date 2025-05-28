const express = require('express');
const router = express.Router();
const {
  handleFindOrCreateUser,
  handleGetUserById,
  handleUpdateUserTokens
} = require('../controllers/userController');

router.post('/', handleFindOrCreateUser);
router.get('/:id', handleGetUserById);
router.put('/:id/tokens', handleUpdateUserTokens);

module.exports = router;
