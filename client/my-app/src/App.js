import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import NavBar from './components/NavBar';
import { observer } from 'mobx-react-lite';
import { Context } from '.';
import { check } from './http/userAPI';
import { Spinner } from 'react-bootstrap';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SupportWidget from './components/SupportWidget';
import Footer from './components/Footer';

const App = observer(() => {
    const { user, favorites } = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Проверяем токен при загрузке приложения
        check().then(userData => {
            user.setUser(userData);
            user.setIsAuth(true);
            // Если пользователь авторизован, загружаем его избранное
            favorites.fetchFavoritesAction();
        }).catch(() => {
            // Если токен невалидный или его нет
            user.setIsAuth(false);
            // Очищаем локальные данные об избранном
            favorites.clearFavorites();
        }).finally(() => {
            setLoading(false);
        });
    }, [user, favorites]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="success" />
            </div>
        );
    }

    return (
        <BrowserRouter>
            <div className="d-flex flex-column min-vh-100">
                <NavBar />
                <main className="flex-grow-1">
                    <AppRouter />
                </main>
                <SupportWidget />
                <ToastContainer position="bottom-right" autoClose={3000} />
                <Footer />
            </div>
        </BrowserRouter>
    );
});

export default App;