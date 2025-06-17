import { $authHost } from "./index";

export const toggleFavorite = async (productId) => {
    const { data } = await $authHost.post('api/favorites/toggle', { productId });
    return data;
};

export const fetchFavorites = async () => {
    const { data } = await $authHost.get('api/favorites');
    return data;
};