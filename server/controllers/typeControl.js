// controllers/typeControl.js
const { Type } = require('../models/models')
const ApiError = require('../error/ApiError')

class TypeController {
    async create(req, res, next) {
        try {
            const { name } = req.body
            if (!name) {
                return next(ApiError.badRequest('Необходимо указать название типа'))
            }
            const type = await Type.create({ name })
            return res.json(type)
        } catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                return next(ApiError.badRequest('Тип с таким названием уже существует'))
            }
            next(ApiError.internal(e.message))
        }
    }

    // Оставляем только одну версию getAll
    async getAll(req, res, next) {
        try {
            const types = await Type.findAll({
                order: [['name', 'ASC']] // Сортируем по имени для удобства пользователя
            });
            return res.json(types);
        } catch (e) {
            next(ApiError.internal('Ошибка получения списка типов'));
        }
    }

    // Методы getOne, update, delete у вас написаны хорошо, их можно оставить без изменений.
    async getOne(req, res, next) { /* ... ваш код ... */ }
    async update(req, res, next) { /* ... ваш код ... */ }
    async delete(req, res, next) { /* ... ваш код ... */ }
}

module.exports = new TypeController()