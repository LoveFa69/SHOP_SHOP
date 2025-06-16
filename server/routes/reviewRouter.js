// server/routes/reviewRouter.js

const Router = require('express');
const router = new Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

// Добавление отзыва (только для авторизованных пользователей)
router.post('/', authMiddleware, reviewController.create);
// Получение отзывов (доступно всем)
router.get('/', reviewController.getAll);

module.exports = router;