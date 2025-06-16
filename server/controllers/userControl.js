const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Basket } = require('../models/models');
const { v4: uuidv4 } = require('uuid');

const generateReferralCode = () => {
    return uuidv4().split('-')[0].toUpperCase();
};

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
            let comparePassword = bcrypt.compareSync(password, user.password);
            if (!comparePassword) {
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

    async createAdmin(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return next(ApiError.badRequest('Некорректный email или пароль'));
            }
            const candidate = await User.findOne({ where: { email } });
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует'));
            }
            const hashPassword = await bcrypt.hash(password, 5);
            const admin = await User.create({ email, role: 'ADMIN', password: hashPassword, referralCode: generateReferralCode() });
            return res.json({ message: 'Администратор успешно создан', user: { id: admin.id, email: admin.email, role: admin.role } });
        } catch (e) {
            next(ApiError.internal('Ошибка при создании администратора: ' + e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const users = await User.findAll({ attributes: ['id', 'email', 'role'], order: [['createdAt', 'DESC']] });
            return res.json(users);
        } catch (e) {
            next(ApiError.internal('Ошибка при получении списка пользователей'));
        }
    }

    // --- НОВЫЙ МЕТОД ---
    async getProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const userProfile = await User.findByPk(userId, {
                // Явно указываем, какие поля можно возвращать, чтобы не слить пароль
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
}

module.exports = new UserControl();