const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
    referralCode: { type: DataTypes.STRING, unique: true, allowNull: false },
    // ID пользователя, который пригласил данного пользователя (если есть)
    referrerId: { type: DataTypes.INTEGER, allowNull: true }
});

const Basket = sequelize.define('basket', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketProduct = sequelize.define('basket_product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 }
});

const Product = sequelize.define('product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    oldPrice: { type: DataTypes.INTEGER, allowNull: true },
    rating: { type: DataTypes.FLOAT, defaultValue: 0 },
    img: { type: DataTypes.STRING, allowNull: false },
    typeId: { type: DataTypes.INTEGER },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    isSpecial: { type: DataTypes.BOOLEAN, defaultValue: false }
});

const Type = sequelize.define('type', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Rating = sequelize.define('rating', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rate: { type: DataTypes.INTEGER, allowNull: false },
    comment: { type: DataTypes.STRING, allowNull: true }
});

const ProductInfo = sequelize.define('product_info', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    productId: { type: DataTypes.INTEGER }
});

// --- НОВЫЕ МОДЕЛИ ---
const Order = sequelize.define('order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: { type: DataTypes.STRING, defaultValue: 'В обработке' },
    totalPrice: { type: DataTypes.FLOAT, allowNull: false },
});

const OrderProduct = sequelize.define('order_product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
});

// --- СВЯЗИ ---

User.hasOne(Basket, { foreignKey: 'userId' });
Basket.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Rating, { foreignKey: 'userId' });
Rating.belongsTo(User, { foreignKey: 'userId' });

Basket.belongsToMany(Product, { through: 'basket_product' });
Product.belongsToMany(Basket, { through: 'basket_product' });

Type.hasMany(Product, { foreignKey: 'typeId' });
Product.belongsTo(Type, { foreignKey: 'typeId' });

Product.hasMany(Rating, { foreignKey: 'productId' });
Rating.belongsTo(Product, { foreignKey: 'productId' });

Product.hasMany(ProductInfo, { as: 'info', foreignKey: 'productId' });
ProductInfo.belongsTo(Product, { foreignKey: 'productId' });

// --- НОВЫЕ СВЯЗИ ---
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.belongsToMany(Product, { through: OrderProduct });
Product.belongsToMany(Order, { through: OrderProduct });

module.exports = {
    User,
    Basket,
    BasketProduct,
    Product,
    Type,
    Rating,
    ProductInfo,
    Order,
    OrderProduct
};