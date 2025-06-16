const Router = require('express');
const router = new Router();

const productRouter = require('./productRouter');
const typeRouter = require('./typeRouter');
const userRouter = require('./userRouter');
const reviewRouter = require('./reviewRouter');
const supportRouter = require('./supportRouter');
const orderRouter = require('./orderRouter'); // Импорт нового роутера

router.use('/user', userRouter);
router.use('/type', typeRouter);
router.use('/product', productRouter);
router.use('/review', reviewRouter);
router.use('/support', supportRouter);
router.use('/order', orderRouter); // Подключение нового роутера

module.exports = router;