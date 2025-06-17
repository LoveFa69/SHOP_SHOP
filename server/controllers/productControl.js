const uuid = require('uuid');
const path = require('path');
const { Product, ProductInfo } = require('../models/models');
const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');
const fs = require('fs');

class ProductControl {
    async create(req, res, next) {
        // --- НАЧАЛО БЛОКА ДИАГНОСТИКИ ---
        console.log('--- НАЧАЛО ЗАПРОСА НА СОЗДАНИЕ ПРОДУКТА ---');
        try {
            // Выводим в лог все, что пришло в теле запроса
            console.log('Получено тело запроса (req.body):', JSON.stringify(req.body, null, 2));

            // Проверяем наличие файлов
            if (!req.files || Object.keys(req.files).length === 0) {
                console.error('ОШИБКА: req.files пуст или отсутствует.');
                return next(ApiError.badRequest('Файл изображения не был загружен'));
            }
            console.log('Получены файлы (req.files):', Object.keys(req.files));
            const { img } = req.files;
            
            // --- ПУЛЕНЕПРОБИВАЕМОЕ ПОЛУЧЕНИЕ ДАННЫХ ---
            // Обращаемся к свойствам req.body напрямую, без деструктуризации
            const name = req.body.name;
            const price = req.body.price;
            const oldPrice = req.body.oldPrice;
            const typeId = req.body.typeId;
            const quantity = req.body.quantity;
            const isSpecial = req.body.isSpecial;
            const unit = req.body.unit; // Получаем unit
            const info = req.body.info;

            // Выводим в лог каждую переменную
            console.log(`Имя: ${name}, Цена: ${price}, Старая цена: ${oldPrice}, ТипID: ${typeId}, Кол-во: ${quantity}, Спец: ${isSpecial}, Ед.изм: ${unit}`);

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
                // Используем переменную unit, которая теперь точно определена (может быть undefined, но не вызовет ReferenceError)
                unit: unit || 'шт.'
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
                    console.error('Ошибка парсинга характеристик (info):', e.message);
                }
            }

            console.log('Продукт успешно создан. ID:', product.id);
            console.log('--- КОНЕЦ ЗАПРОСА ---');
            return res.json(product);

        } catch (e) {
            console.error('!!! КРИТИЧЕСКАЯ ОШИБКА ВНУТРИ CATCH !!!');
            console.error(e);
            return next(ApiError.internal('Внутренняя ошибка сервера при создании продукта.'));
        }
    }

    // Методы getAll, getSpecials, getOne, delete остаются без изменений
    async getAll(req, res, next) { /* ... ваш код ... */ }
    async getSpecials(req, res, next) { /* ... ваш код ... */ }
    async getOne(req, res, next) { /* ... ваш код ... */ }
    async delete(req, res, next) { /* ... ваш код ... */ }
}

module.exports = new ProductControl();