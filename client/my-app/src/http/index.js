import axios from "axios";

// Базовые настройки axios
const axiosSettings = {
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000, // Таймаут запроса 5 секунд
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

// Создаем инстансы
const $host = axios.create(axiosSettings);
const $authHost = axios.create(axiosSettings);

// Интерцептор для авторизации
const authInterceptor = config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Интерцептор для обработки ошибок
const errorInterceptor = error => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        console.error('Не авторизован');
        // Можно добавить редирект на логин
        break;
      case 403:
        console.error('Доступ запрещен');
        break;
      case 404:
        console.error('Ресурс не найден');
        break;
      case 500:
        console.error('Ошибка сервера');
        break;
      default:
        console.error('Неизвестная ошибка');
    }
  }
  return Promise.reject(error);
};

// Добавляем интерцепторы
$authHost.interceptors.request.use(authInterceptor);
$host.interceptors.response.use(response => response, errorInterceptor);
$authHost.interceptors.response.use(response => response, errorInterceptor);

export { $host, $authHost };