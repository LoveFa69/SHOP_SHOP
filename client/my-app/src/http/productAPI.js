import { $authHost, $host } from "./index";

// ==================== ТИПЫ ====================
export const createType = async (typeData) => {
  const { data } = await $authHost.post('api/type', typeData);
  return data;
};

export const fetchTypes = async () => {
  const { data } = await $host.get('api/type');
  return data;
};

// ==================== ПРОДУКТЫ ====================
export const createProduct = async (formData) => {
  // Добавляем третий аргумент с конфигурацией
  const { data } = await $authHost.post('/api/product', formData, {
    // Явно указываем заголовок для отправки файлов
    headers: {
      'Content-Type': 'multipart/form-data'
    }
    });
    return data;
};

export const fetchProducts = async (typeId, page = 1, limit = 9, name = '') => {
  const { data } = await $host.get('/api/product', {
    params: {
      typeId,
      page,
      limit,
      name
    }
  });
  return data;
};

export const fetchOneProduct = async (id) => {
  const { data } = await $host.get(`/api/product/${id}`);
  return data;
};

export const fetchSpecialProducts = async () => {
    const { data } = await $host.get('api/product/special');
    return data;
};

// ==================== ОТЗЫВЫ ====================
export const addReview = async (reviewData) => {
    const { data } = await $authHost.post('api/review', reviewData);
    return data;
};

export const fetchReviews = async (productId) => {
    const { data } = await $host.get('api/review', { params: { productId } });
    return data;
};

// ==================== УДАЛЕНИЕ ====================
export const deleteType = async (id) => {
    const { data } = await $authHost.delete(`api/type/${id}`);
    return data;
};

export const deleteProduct = async (id) => {
    const { data } = await $authHost.delete(`api/product/${id}`);
    return data;
};
