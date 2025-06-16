const jwt = require('jsonwebtoken');

module.exports = function(role) {
    return (req, res, next) => {
        // Пропускаем OPTIONS-запросы для CORS
        if (req.method === "OPTIONS") {
            return next();
        }

        try {
            // Проверяем наличие заголовка Authorization
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: "Не авторизован: отсутствует токен" });
            }

            // Извлекаем токен из заголовка
            const token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "Не авторизован: неверный формат токена" });
            }

            // Верифицируем токен
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded;
            
            // Проверяем роль (если роль не указана, пропускаем любую авторизованную роль)
            if (role && decoded.role !== role) {
                return res.status(403).json({ message: "Доступ запрещен: недостаточно прав" });
            }

            // Добавляем данные пользователя в запрос
            req.user = decoded;
            next();
            
        } catch (e) {
            // Обрабатываем разные типы ошибок
            if (e.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Токен истек" });
            }
            if (e.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: "Неверный токен" });
            }
            return res.status(401).json({ message: "Ошибка авторизации" });
        }
    };
};