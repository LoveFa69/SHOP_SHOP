const uuid = require('uuid');
const path = require('path');
const { Product, ProductInfo } = require('../models/models');
const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');
const fs = require('fs');

class ProductControl {
    async create(req, res, next) {
        try {
            if (!req.files || Object.keys(req.files).length === 0) {
                return next(ApiError.badRequest('Файл изображения не был загружен'));
            }
            const { img } = req.files;
            const { name, price, oldPrice, typeId, quantity, isSpecial, info } = req.body;
            if (!name || !price || !typeId) {
                return next(ApiError.badRequest('Не все обязательные поля (название, цена, тип) были предоставлены'));
            }
            let fileName = uuid.v4() + ".jpg";
            await img.mv(path.resolve(__dirname, '..', 'static', fileName));
            const productData = { name, price, typeId, img: fileName, quantity: quantity || 0, isSpecial: isSpecial === 'true' || false, };
            if (oldPrice) {
                productData.oldPrice = oldPrice;
            }
            const product = await Product.create(productData);
            if (info) {
                try {
                    const parsedInfo = JSON.parse(info);
                    if (Array.isArray(parsedInfo)) {
                        await Promise.all(parsedInfo.map(i => ProductInfo.create({ title: i.title, description: i.description, productId: product.id })));
                    }
                } catch (e) { console.error('Ошибка парсинга характеристик (info):', e); }
            }
            return res.json(product);
        } catch (e) {
            console.error('ПОЛНАЯ ОШИБКА В CATCH:', e);
            return next(ApiError.internal('Ошибка при создании продукта: ' + e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            // Добавляем sortBy в параметры
            const { typeId, name, sortBy, limit = 9, page = 1 } = req.query;
            const offset = page * limit - limit;
            
            let whereClause = { isSpecial: false };
            if (typeId) { whereClause.typeId = typeId; }
            if (name) { whereClause.name = { [Op.iLike]: `%${name}%` }; }

            // --- НОВАЯ ЛОГИКА СОРТИРОВКИ ---
            let orderOption = [['createdAt', 'DESC']]; // Сортировка по умолчанию (новые)
            if (sortBy === 'price_asc') {
                orderOption = [['price', 'ASC']];
            } else if (sortBy === 'price_desc') {
                orderOption = [['price', 'DESC']];
            }
            // -----------------------------

            const products = await Product.findAndCountAll({
                where: whereClause,
                limit,
                offset,
                order: orderOption, // Применяем выбранную сортировку
            });
            return res.json(products);
        } catch (e) {
            next(ApiError.internal('Ошибка при получении продуктов: ' + e.message));
        }
    }

    async getSpecials(req, res, next) { /* ... код без изменений ... */ }
    async getOne(req, res, next) { /* ... код без изменений ... */ }
    async delete(req, res, next) { /* ... код без изменений ... */ }
}

module.exports = new ProductControl();