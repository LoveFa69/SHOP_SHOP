import { $authHost } from "./index";

/**
 * Создает новый заказ на сервере.
 * @param {object} orderData - Данные заказа { items, totalPrice }.
 * @returns {Promise<object>}
 */
export const createOrder = async (orderData) => {
    const { data } = await $authHost.post('api/order', orderData);
    return data;
};

/**
 * Получает историю заказов текущего пользователя.
 * @returns {Promise<Array>}
 */
export const fetchOrders = async () => {
    const { data } = await $authHost.get('api/order');
    return data;
};