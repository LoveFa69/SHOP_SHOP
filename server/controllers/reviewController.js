const { Rating, Product, User } = require('../models/models');
const ApiError = require('../error/ApiError');
class ReviewController {
    async create(req, res, next) {
        try {
            const { productId, rate, comment } = req.body;
            const userId = req.user.id;
            if (!productId || !rate) {
                return next(ApiError.badRequest('Не указан товар или оценка'));
            }
            const existingRating = await Rating.findOne({ where: { userId, productId } });
            if (existingRating) {
                return next(ApiError.badRequest('Вы уже оставляли отзыв на этот товар'));
            }
            await Rating.create({
                rate,
                comment,
                userId,
                productId
            });
            const allRatingsForProduct = await Rating.findAll({ where: { productId } });
            const totalRateSum = allRatingsForProduct.reduce((sum, item) => sum + item.rate, 0);
            
            let averageRating = 0;
            if (allRatingsForProduct.length > 0) {
                const roundedString = (totalRateSum / allRatingsForProduct.length).toFixed(1);
                averageRating = parseFloat(roundedString);
            }
            await Product.update({ rating: averageRating }, { where: { id: productId } });
            return res.json({ message: 'Спасибо за ваш отзыв!' });
        } catch (e) {
            return next(ApiError.internal('Ошибка при добавлении отзыва: ' + e.message));
        }
    }
    async getAll(req, res, next) {
        try {
            const { productId } = req.query;
            if (!productId) {
                return next(ApiError.badRequest('Не указан ID товара'));
            }
            const reviews = await Rating.findAll({
                where: { productId },
                include: [{ model: User, attributes: ['email'] }],
                order: [['createdAt', 'DESC']]
            });
            return res.json(reviews);
        } catch (e) {
            return next(ApiError.internal('Ошибка при получении отзывов: ' + e.message));
        }
    }
}
module.exports = new ReviewController();