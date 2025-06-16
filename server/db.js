const { Sequelize } = require('sequelize');

// Проверяем, есть ли переменная DATABASE_URL (для Render)
if (process.env.DATABASE_URL) {
  // Конфигурация для продакшена (Render)
  module.exports = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Эта опция важна для Render
      },
    },
  });
} else {
  // Конфигурация для локальной разработки (оставляем твой старый вариант)
  module.exports = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
    }
  );
}