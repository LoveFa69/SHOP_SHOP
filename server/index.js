// server/index.js

require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const cors = require('cors');
const fileUpload = require('express-fileupload'); // Импорт
const routes = require('./routes/index');
const ErrorHandler = require('./middleware/ErrorHandlingMiddleware');
const path = require('path');

const PORT = process.env.PORT || 5000;

const app = express();

// --- ПРАВИЛЬНЫЙ ПОРЯДОК MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));

// 1. Сначала подключаем обработчик файлов
app.use(fileUpload({}));

// 2. Только потом подключаем роуты, которые эти файлы будут использовать
app.use('/api', routes);

// Обработчик ошибок всегда должен быть в самом конце
app.use(ErrorHandler);
// ------------------------------------

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); 
    } catch (e) {
        console.log(e);
    }
};

start();