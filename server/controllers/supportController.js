// server/controllers/supportController.js

const { sendMessageToSupport } = require('../services/telegramService');
const ApiError = require('../error/ApiError');

class SupportController {
    async sendMessage(req, res, next) {
        try {
            const { name, email, message } = req.body;

            if (!name || !email || !message) {
                return next(ApiError.badRequest('Все поля обязательны для заполнения'));
            }

            // Формируем красивое сообщение для отправки в Telegram
            const formattedMessage = `
*Новое сообщение в техподдержку!*

*От:* ${name}
*Email:* \`${email}\`

*Сообщение:*
${message}
            `;

            await sendMessageToSupport(formattedMessage);

            return res.json({ success: true, message: 'Ваше сообщение успешно отправлено!' });

        } catch (e) {
            return next(ApiError.internal('Не удалось отправить сообщение. Попробуйте позже.'));
        }
    }
}

module.exports = new SupportController();