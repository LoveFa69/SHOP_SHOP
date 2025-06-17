const sequelize = require('../db');
const { DataTypes } = require('sequelize');

// --- ОПРЕДЕЛЕНИЕ МОДЕЛЕЙ ---

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
    referralCode: { type: DataTypes.STRING, unique: true, allowNull: true },
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
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    isSpecial: { type: DataTypes.BOOLEAN, defaultValue: false },
    unit: { type: DataTypes.STRING, allowNull: false, defaultValue: 'шт.' },
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
});

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

// Промежуточная таблица для Избранного.
// Sequelize автоматически добавит в нее `userId` и `productId`.
const UserFavorites = sequelize.define('user_favorites', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});


// --- ОПРЕДЕЛЕНИЕ СВЯЗЕЙ ---

// User <-> Basket
User.hasOne(Basket, { foreignKey: 'userId' });
Basket.belongsTo(User, { foreignKey: 'userId' });

// User <-> Rating
User.hasMany(Rating, { foreignKey: 'userId' });
Rating.belongsTo(User, { foreignKey: 'userId' });

// User <-> Order
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

// Basket <-> Product (через BasketProduct)
Basket.belongsToMany(Product, { through: BasketProduct });
Product.belongsToMany(Basket, { through: BasketProduct });

// Type <-> Product
Type.hasMany(Product, { foreignKey: 'typeId' });
Product.belongsTo(Type, { foreignKey: 'typeId' });

// Product <-> Rating
Product.hasMany(Rating, { foreignKey: 'productId' });
Rating.belongsTo(Product, { foreignKey: 'productId' });

// Product <-> ProductInfo
Product.hasMany(ProductInfo, { as: 'info', foreignKey: 'productId' });
ProductInfo.belongsTo(Product, { foreignKey: 'productId' });

// Order <-> Product (через OrderProduct)
Order.belongsToMany(Product, { through: OrderProduct });
Product.belongsToMany(Order, { through: OrderProduct });

// User <-> Product (для Избранного, через UserFavorites)
User.belongsToMany(Product, { through: UserFavorites, as: 'favoriteProducts' });
Product.belongsToMany(User, { through: UserFavorites, as: 'favoritedBy' });

// --- ЭКСПОРТ ВСЕХ МОДЕЛЕЙ ---
module.exports = {
    User,
    Basket,
    BasketProduct,
    Product,
    Type,
    Rating,
    ProductInfo,
    Order,
    OrderProduct,
    UserFavorites
};