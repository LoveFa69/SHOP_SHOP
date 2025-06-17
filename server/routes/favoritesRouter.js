const Router = require('express');
const router = new Router();
const favoritesController = require('../controllers/favoritesController');
const authMiddleware = require('../middleware/authMiddleware');

// Все действия с избранным требуют авторизации
router.post('/toggle', authMiddleware, favoritesController.toggle);
router.get('/', authMiddleware, favoritesController.getAll);

module.exports = router;