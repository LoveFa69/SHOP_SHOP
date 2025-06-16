const Router = require('express');
const router = new Router();
const supportController = require('../controllers/supportController');

// Этот роут будет принимать сообщения от фронтенда
router.post('/', supportController.sendMessage);

module.exports = router;