const { User } = require('../models/models');
const ApiError = require('../error/ApiError');

class FavoritesController {
    // Добавление/удаление из избранного
    async toggle(req, res, next) {
        try {
            const { productId } = req.body;
            const userId = req.user.id;

            if (!productId) {
                return next(ApiError.badRequest('Не указан ID товара'));
            }

            const user = await User.findByPk(userId);

            // --- ДОБАВЛЕНА ПРОВЕРКА ---
            // Если по какой-то причине пользователя с ID из токена нет в базе
            if (!user) {
                return next(ApiError.unauthorized('Пользователь не найден, пожалуйста, войдите заново'));
            }
            // -------------------------

            const hasFavorite = await user.hasFavoriteProduct(productId);

            if (hasFavorite) {
                await user.removeFavoriteProduct(productId);
                return res.json({ message: 'Товар удален из избранного' });
            } else {
                await user.addFavoriteProduct(productId);
                return res.json({ message: 'Товар добавлен в избранное' });
            }
        } catch (e) {
            return next(ApiError.internal('Ошибка при работе с избранным: ' + e.message));
        }
    }

    // Получение списка избранных товаров
    async getAll(req, res, next) {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);

            // --- ДОБАВЛЕНА ПРОВЕРКА ---
            if (!user) {
                return next(ApiError.unauthorized('Пользователь не найден, пожалуйста, войдите заново'));
            }
            // -------------------------

            const favorites = await user.getFavoriteProducts();
            return res.json(favorites);
        } catch (e) {
            return next(ApiError.internal('Ошибка при получении избранных товаров'));
        }
    }
}

module.exports = new FavoritesController();