const router = require('express').Router();
const userController = require('../controllers/userController');

router.post('/', userController.handleFindOrCreateUser);
router.get('/:id', userController.handleGetUserById);
router.put('/:id/tokens', userController.handleUpdateUserTokens);

module.exports = router;
