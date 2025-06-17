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

            const productData = {
                name,
                price,
                typeId,
                img: fileName,
                quantity: quantity || 0,
                isSpecial: isSpecial === 'true' || false,
                unit: unit || 'шт.',
            };

            if (oldPrice) {
                productData.oldPrice = oldPrice;
            }

            const product = await Product.create(productData);

            if (info) {
                try {
                    const parsedInfo = JSON.parse(info);
                    if (Array.isArray(parsedInfo)) {
                        await Promise.all(parsedInfo.map(i =>
                            ProductInfo.create({
                                title: i.title,
                                description: i.description,
                                productId: product.id
                            })
                        ));
                    }
                } catch (e) {
                    console.error('Ошибка парсинга характеристик (info):', e);
                }
            }

            return res.json(product);
        } catch (e) {
            console.error('ПОЛНАЯ ОШИБКА В CATCH:', e);
            return next(ApiError.internal('Ошибка при создании продукта: ' + e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const { typeId, name, limit = 9, page = 1 } = req.query;
            const offset = page * limit - limit;
            
            // --- ИСПРАВЛЕННАЯ ЛОГИКА ---
            let whereClause = {
                // Выбираем товары, у которых isSpecial равно false ИЛИ isSpecial равно NULL
                [Op.or]: [
                    { isSpecial: false },
                    { isSpecial: null }
                ]
            };
            // ---------------------------

            if (typeId) {
                whereClause.typeId = typeId;
            }

            if (name) {
                whereClause.name = { [Op.iLike]: `%${name}%` };
            }

            const products = await Product.findAndCountAll({
                where: whereClause,
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });
            return res.json(products);
        } catch (e) {
            next(ApiError.internal('Ошибка при получении продуктов: ' + e.message));
        }
    }

    async getSpecials(req, res, next) {
        try {
            const specialProducts = await Product.findAll({
                where: { isSpecial: true },
                limit: 4
            });
            return res.json(specialProducts);
        } catch (e) {
            return next(ApiError.internal('Ошибка при получении спецпредложений'));
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const product = await Product.findOne({
                where: { id },
                include: [{ model: ProductInfo, as: 'info' }]
            });
            if (!product) {
                return next(ApiError.notFound('Продукт не найден'));
            }
            return res.json(product);
        } catch (e) {
            next(ApiError.internal('Ошибка при получении продукта: ' + e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                return next(ApiError.badRequest('Не указан ID продукта'));
            }
            const product = await Product.findOne({ where: { id } });
            if (!product) {
                return next(ApiError.notFound('Продукт для удаления не найден'));
            }
            await Product.destroy({ where: { id } });
            if (product.img) {
                const filePath = path.resolve(__dirname, '..', 'static', product.img);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            return res.json({ message: 'Продукт успешно удален' });
        } catch (e) {
            return next(ApiError.internal('Ошибка при удалении продукта: ' + e.message));
        }
    }
}

module.exports = new ProductControl();