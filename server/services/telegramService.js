const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

// Проверяем, что токен и ID чата заданы
if (!token || !chatId) {
    console.error('Ошибка: Не заданы переменные окружения TELEGRAM_TOKEN или TELEGRAM_CHAT_ID');
}

const bot = new TelegramBot(token);

const sendMessageToSupport = (message) => {
    if (!token || !chatId) {
        return Promise.reject('Бот не сконфигурирован');
    }
    // Используем parse_mode: 'Markdown' для красивого форматирования
    return bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
};

module.exports = { sendMessageToSupport };