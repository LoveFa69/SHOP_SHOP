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
    const { user, favorites } = useContext(Context); // Добавляем favorites store
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        check()
            .then(userData => {
                user.setUser(userData);
                user.setIsAuth(true);
                favorites.fetchFavoritesAction(); // Загружаем избранное при успешной авторизации
            })
            .catch(() => {
                user.setIsAuth(false);
            })
            .finally(() => setLoading(false));
    }, [user, favorites]); // Добавляем favorites в зависимости

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