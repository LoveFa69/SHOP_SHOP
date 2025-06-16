const { Order, OrderProduct, Product } = require('../models/models');
const ApiError = require('../error/ApiError');

class OrderController {
    /**
     * Создание нового заказа на основе корзины
     */
    async create(req, res, next) {
        try {
            const userId = req.user.id;
            const { items, totalPrice } = req.body;

            if (!items || items.length === 0) {
                return next(ApiError.badRequest('Корзина пуста. Невозможно создать заказ.'));
            }

            // Создаем основную запись о заказе
            const order = await Order.create({ userId, totalPrice });

            // Для каждого товара из корзины создаем связанную запись в OrderProduct
            for (const item of items) {
                await OrderProduct.create({
                    orderId: order.id,
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price, // Фиксируем цену на момент покупки
                });

                // Уменьшаем количество товара на складе
                const product = await Product.findByPk(item.id);
                if (product && product.quantity >= item.quantity) {
                    product.quantity -= item.quantity;
                    await product.save();
                } else {
                    // Если товара вдруг не хватило, нужно откатить транзакцию (в будущем)
                    // А пока просто сообщим об ошибке
                    return next(ApiError.badRequest(`Товара "${item.name}" не хватает на складе.`));
                }
            }

            return res.json({ message: 'Заказ успешно создан!', orderId: order.id });

        } catch (e) {
            return next(ApiError.internal('Ошибка при создании заказа: ' + e.message));
        }
    }

    /**
     * Получение истории заказов для текущего пользователя
     */
    async getAll(req, res, next) {
        try {
            const userId = req.user.id;
            const orders = await Order.findAll({
                where: { userId },
                include: [{
                    model: Product,
                    attributes: ['id', 'name', 'img'],
                    through: { attributes: ['quantity', 'price'] } // Получаем данные из связующей таблицы
                }],
                order: [['createdAt', 'DESC']] // Сортируем от новых к старым
            });
            return res.json(orders);
        } catch (e) {
            return next(ApiError.internal('Ошибка при получении истории заказов'));
        }
    }
}

module.exports = new OrderController();