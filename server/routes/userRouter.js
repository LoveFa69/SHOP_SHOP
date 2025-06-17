const { Router } = require('express');
const router = Router();
const userController = require('../controllers/userControl');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

// Существующие маршруты
router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', authMiddleware, userController.check);

// Новые маршруты для администраторов
router.post('/create-admin', authMiddleware, checkRole('ADMIN'), userController.createAdmin);
router.get('/all', authMiddleware, checkRole('ADMIN'), userController.getAll);

// Новый роут для получения профиля
router.get('/profile', authMiddleware, userController.getProfile);
router.post('/change-password', authMiddleware, userController.changePassword);

module.exports = router;