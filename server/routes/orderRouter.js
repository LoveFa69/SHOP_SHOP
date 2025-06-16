const Router = require('express');
const router = new Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Все действия с заказами требуют авторизации
router.post('/', authMiddleware, orderController.create);
router.get('/', authMiddleware, orderController.getAll);

module.exports = router;