const express = require('express');
const router = express.Router();
const productControl = require('../controllers/productControl');
const checkRole = require('../middleware/checkRoleMiddleware');

// --- ИСПРАВЛЕННЫЙ ПОРЯДОК РОУТОВ ---

// Создание продукта (только для админа)
router.post('/', checkRole('ADMIN'), productControl.create);

// Получение всех "обычных" продуктов
router.get('/', productControl.getAll);

// Получение спецпредложений (конкретный роут должен идти ДО динамического)
router.get('/special', productControl.getSpecials);

// Получение одного продукта по ID (динамический роут с параметром)
router.get('/:id', productControl.getOne);

// Удаление продукта (только для админа)
router.delete('/:id', checkRole('ADMIN'), productControl.delete);


module.exports = router;