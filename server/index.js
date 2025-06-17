require('dotenv').config();

// Импортируем необходимые модули
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models'); // Импортируем модели, чтобы Sequelize их "увидел"
const cors = require('cors'); // Для разрешения кросс-доменных запросов
const fileUpload = require('express-fileupload'); // Для обработки загрузки файлов
const path = require('path'); // Встроенный модуль Node.js для работы с путями

// Импортируем основной роутер и обработчик ошибок
const router = require('./routes/index');
const ErrorHandlingMiddleware = require('./middleware/ErrorHandlingMiddleware');

// Определяем порт. Берем из .env, или используем 5000 по умолчанию
const PORT = process.env.PORT || 5000;

// Создаем приложение Express
const app = express();

// --- Подключение Middleware (промежуточного ПО) ---
// Порядок подключения очень важен!

// 1. Разрешаем CORS-запросы со всех доменов
app.use(cors());

// 2. Позволяем приложению парсить JSON-тела запросов
app.use(express.json());

// 3. Указываем Express, что нужно раздавать статические файлы из папки 'static'
// Это необходимо для отображения картинок товаров
app.use(express.static(path.resolve(__dirname, 'static')));

// 4. Подключаем middleware для парсинга файлов. Он должен идти до роутов.
app.use(fileUpload({}));

// 5. Подключаем основной роутер. Все запросы, начинающиеся с /api, будут идти в него.
app.use('/api', router);

// 6. Обработчик ошибок. Это middleware должен быть последним в цепочке.
app.use(ErrorHandlingMiddleware);
// ------------------------------------------------

// Асинхронная функция для запуска сервера
const start = async () => {
    try {
        // Проверяем подключение к базе данных
        await sequelize.authenticate();
        console.log('Подключение к базе данных успешно установлено.');
        
        // Синхронизируем модели с базой данных (создаем таблицы, если их нет)
        await sequelize.sync();
        console.log('Модели синхронизированы с базой данных.');
        
        // Запускаем сервер на прослушивание указанного порта
        app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));

    } catch (e) {
        // В случае ошибки выводим ее в консоль
        console.error('Не удалось запустить сервер:', e);
    }
};

// Вызываем функцию запуска
start();