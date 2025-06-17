// src/pages/ProfilePage.js
import React, { useEffect, useState, useContext } from 'react';
import { Container, Card, Row, Col, Spinner, Alert, Button, Form } from 'react-bootstrap';
import { fetchProfile, changePassword } from '../http/userAPI';
import { toast } from 'react-toastify';
import { FaCopy, FaHeart, FaShoppingBag } from 'react-icons/fa';
import { Context } from '..';
import { useNavigate } from 'react-router-dom';
import { ORDERS_ROUTE, FAVORITES_ROUTE } from '../utils/consts';

const ProfilePage = () => {
    const { favorites, user } = useContext(Context);
    const navigate = useNavigate();

    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Состояния для формы смены пароля
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isPasswordChanging, setIsPasswordChanging] = useState(false);

    useEffect(() => {
        fetchProfile()
            .then(data => setProfile(data))
            .catch(e => setError(e.response?.data?.message || 'Не удалось загрузить профиль'))
            .finally(() => setLoading(false));
    }, []);

    const handleCopyCode = () => { /* ... код без изменений ... */ };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setIsPasswordChanging(true);
        try {
            const response = await changePassword({ oldPassword, newPassword });
            toast.success(response.message);
            setOldPassword('');
            setNewPassword('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Произошла ошибка');
        } finally {
            setIsPasswordChanging(false);
        }
    };

    if (loading) return <Container className="d-flex justify-content-center mt-5"><Spinner animation="border" /></Container>;
    if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;

    return (
        <Container className="my-5">
            <h2 className="mb-4">Личный кабинет</h2>
            <Row>
                {/* Левая колонка со статистикой и сменой пароля */}
                <Col lg={8} className="mb-4 mb-lg-0">
                    {/* Карточка смены пароля */}
                    <Card className="shadow-sm mb-4">
                        <Card.Header as="h5">Смена пароля</Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleChangePassword}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Старый пароль</Form.Label>
                                    <Form.Control type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Новый пароль</Form.Label>
                                    <Form.Control type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                                </Form.Group>
                                <Button variant="primary" type="submit" disabled={isPasswordChanging}>
                                    {isPasswordChanging ? 'Сохранение...' : 'Сменить пароль'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>

                    {/* Карточка реферальной программы */}
                     <Card className="shadow-sm">
                        <Card.Header as="h5">Ваша реферальная программа</Card.Header>
                        <Card.Body>
                            <p>Поделитесь этим кодом с друзьями, чтобы получить скидку!</p>
                            <div className="d-flex align-items-center gap-3 p-3 bg-light rounded">
                                <strong className="fs-4 text-success font-monospace">{profile.referralCode}</strong>
                                <Button variant="outline-secondary" size="sm" onClick={handleCopyCode}><FaCopy className="me-2" /> Копировать</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Правая колонка с основной информацией и быстрыми ссылками */}
                <Col lg={4}>
                    <Card className="shadow-sm">
                        <Card.Header as="h5">Профиль</Card.Header>
                        <Card.Body>
                            <p><strong>Email:</strong> {user.user?.email}</p>
                            <p><strong>Роль:</strong> {user.user?.role}</p>
                            <hr />
                            <div className="d-grid gap-2">
                                <Button variant="outline-secondary" onClick={() => navigate(ORDERS_ROUTE)}>
                                    <FaShoppingBag className="me-2" /> Мои заказы
                                </Button>
                                <Button variant="outline-secondary" onClick={() => navigate(FAVORITES_ROUTE)}>
                                    <FaHeart className="me-2" /> Избранное ({favorites.favoriteIds.size})
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage;