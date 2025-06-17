import { $authHost, $host } from ".";
import { jwtDecode } from "jwt-decode";

export const registration = async (email, password, referrerCode) => {
    const { data } = await $host.post('api/user/registration', {
        email,
        password,
        role: 'USER',
        referrerCode
    });
    localStorage.setItem('token', data.token);
    return jwtDecode(data.token);
};

export const login = async (email, password) => {
    const { data } = await $host.post('api/user/login', { email, password });
    localStorage.setItem('token', data.token);
    return jwtDecode(data.token);
};

export const check = async () => {
    const { data } = await $authHost.get('api/user/auth');
    localStorage.setItem('token', data.token);
    return jwtDecode(data.token);
};

export const sendSupportMessage = async (data) => {
    const response = await $host.post('api/support', data);
    return response.data;
};

// --- НОВАЯ ФУНКЦИЯ ---
export const fetchProfile = async () => {
    const { data } = await $authHost.get('api/user/profile');
    return data;
};

export const changePassword = async (passwordData) => {
    const { data } = await $authHost.post('api/user/change-password', passwordData);
    return data;
};