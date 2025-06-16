const express = require('express');
const router = express.Router();
const productControl = require('../controllers/productControl');
const checkRole = require('../middleware/checkRoleMiddleware');

// --- ПРАВИЛЬНЫЙ ПОРЯДОК ---

// Создание продукта (только админ)
router.post('/', checkRole('ADMIN'), productControl.create);

// Получение всех "обычных" продуктов
router.get('/', productControl.getAll);

// Получение спецпредложений (конкретный роут)
// Он должен быть определен ДО роута с параметром /:id
router.get('/special', productControl.getSpecials);

// Получение одного продукта по ID (динамический роут)
router.get('/:id', productControl.getOne);

// Удаление продукта (только админ)
router.delete('/:id', checkRole('ADMIN'), productControl.delete);


module.exports = router;