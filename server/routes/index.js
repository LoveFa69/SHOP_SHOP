const Router = require('express');
const router = new Router();

const productRouter = require('./productRouter');
const typeRouter = require('./typeRouter');
const userRouter = require('./userRouter');
const reviewRouter = require('./reviewRouter');
const supportRouter = require('./supportRouter');
const orderRouter = require('./orderRouter');
const favoritesRouter = require('./favoritesRouter'); // Импорт

router.use('/user', userRouter);
router.use('/type', typeRouter);
router.use('/product', productRouter);
router.use('/review', reviewRouter);
router.use('/support', supportRouter);
router.use('/order', orderRouter);
router.use('/favorites', favoritesRouter); // Подключение

module.exports = router;