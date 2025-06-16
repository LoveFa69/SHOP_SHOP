const ApiError = require('../error/ApiError');

module.exports = function(err, req, res, next) {
    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message });
    }
    console.error(err); // выводим ошибку в консоль для отладки
    return res.status(500).json({ message: "Что-то пошло не так" });
}