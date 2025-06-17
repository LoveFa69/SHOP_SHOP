const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = 'jsonwebtoken';
const { User, Basket } = require('../models/models');
const { v4: uuidv4 } = require('uuid'); // Для генерации уникальных кодов

// Функция для генерации уникального реферального кода
const generateReferralCode = () => {
    // Берем первую часть UUID и переводим в верхний регистр. Например, 550E8400
    return uuidv4().split('-')[0].toUpperCase();
};

// Функция для генерации JWT токена
const generateJwt = (id, email, role) => {
    return jwt.sign(
        { id, email, role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );
};

class UserControl {
    async registration(req, res, next) {
        try {
            const { email, password, referrerCode } = req.body;
            if (!email || !password) {
                return next(ApiError.badRequest('Некорректный email или пароль'));
            }
            if (password.length < 6) {
                return next(ApiError.badRequest('Пароль должен быть не менее 6 символов'));
            }
            const candidate = await User.findOne({ where: { email } });
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует'));
            }

            let referrerId = null;
            if (referrerCode) {
                const referrer = await User.findOne({ where: { referralCode: referrerCode.toUpperCase() } });
                if (referrer) {
                    referrerId = referrer.id;
                } else {
                    return next(ApiError.badRequest('Указанный реферальный код не найден'));
                }
            }

            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({
                email,
                role: 'USER',
                password: hashPassword,
                referralCode: generateReferralCode(),
                referrerId: referrerId
            });

            await Basket.create({ userId: user.id });
            const token = generateJwt(user.id, user.email, user.role);
            return res.json({ token });
        } catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                return next(ApiError.internal('Произошла ошибка при генерации уникального кода. Попробуйте еще раз.'));
            }
            return next(ApiError.internal(e.message));
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return next(ApiError.badRequest('Пользователь с таким email не найден'));
            }
            const isPasswordCorrect = bcrypt.compareSync(password, user.password);
            if (!isPasswordCorrect) {
                return next(ApiError.badRequest('Указан неверный пароль'));
            }
            const token = generateJwt(user.id, user.email, user.role);
            return res.json({ token });
        } catch (e) {
            next(ApiError.internal('Ошибка при входе: ' + e.message));
        }
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role);
        return res.json({ token });
    }

    async getProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const userProfile = await User.findByPk(userId, {
                attributes: ['id', 'email', 'role', 'referralCode']
            });
            if (!userProfile) {
                return next(ApiError.notFound('Профиль пользователя не найден'));
            }
            return res.json(userProfile);
        } catch (e) {
            return next(ApiError.internal('Ошибка получения данных профиля'));
        }
    }

    // --- НОВЫЙ МЕТОД ДЛЯ СМЕНЫ ПАРОЛЯ ---
    async changePassword(req, res, next) {
        try {
            const { oldPassword, newPassword } = req.body;
            const userId = req.user.id;

            if (!oldPassword || !newPassword) {
                return next(ApiError.badRequest('Не все поля заполнены'));
            }
            if (newPassword.length < 6) {
                return next(ApiError.badRequest('Новый пароль должен быть не менее 6 символов'));
            }

            const user = await User.findByPk(userId);
            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'));
            }

            const isOldPasswordCorrect = bcrypt.compareSync(oldPassword, user.password);
            if (!isOldPasswordCorrect) {
                return next(ApiError.badRequest('Старый пароль введен неверно'));
            }

            const hashPassword = await bcrypt.hash(newPassword, 5);
            user.password = hashPassword;
            await user.save();

            return res.json({ message: 'Пароль успешно изменен!' });
        } catch (e) {
            return next(ApiError.internal('Ошибка при смене пароля: ' + e.message));
        }
    }

    // --- Методы для администрирования ---

     async createAdmin(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return next(ApiError.badRequest('Некорректный email или пароль'));
            }
            if (password.length < 6) {
                return next(ApiError.badRequest('Пароль должен быть не менее 6 символов'));
            }

            const candidate = await User.findOne({ where: { email } });
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует'));
            }

            const hashPassword = await bcrypt.hash(password, 5);
            const admin = await User.create({
                email,
                role: 'ADMIN', // Явно указываем роль
                password: hashPassword,
                referralCode: generateReferralCode() // У админа тоже будет реф. код
            });
            
            // Создаем админу корзину, на всякий случай
            await Basket.create({ userId: admin.id });

            return res.json({
                message: 'Администратор успешно создан',
                user: {
                    id: admin.id,
                    email: admin.email,
                    role: admin.role
                }
            });
        } catch (e) {
            return next(ApiError.internal('Ошибка при создании администратора: ' + e.message));
        }
    }

    /**
     * Получение списка всех пользователей с пагинацией.
     * Доступно только администратору.
     */
    async getAll(req, res, next) {
        try {
            // Добавляем пагинацию, как в productController
            let { limit = 10, page = 1 } = req.query;
            let offset = page * limit - limit;

            const users = await User.findAndCountAll({
                attributes: ['id', 'email', 'role', 'createdAt'], // Никогда не возвращаем пароль
                order: [['createdAt', 'DESC']],
                limit,
                offset
            });

            return res.json(users);
        } catch (e) {
            return next(ApiError.internal('Ошибка при получении списка пользователей'));
        }
    }
}

module.exports = new UserControl();