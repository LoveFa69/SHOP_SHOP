import React, { useContext, useState } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { REGISTRATION_ROUTE, LOGIN_ROUTE, SHOP_ROUTE } from '../utils/consts';
import { login, registration } from '../http/userAPI';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { toast } from 'react-toastify';

// Стили для страницы, чтобы не создавать отдельный CSS-файл
const pageStyle = {
    minHeight: 'calc(100vh - 72px)', // Высота экрана минус примерная высота навбара
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to right, #f8f9fa, #e9ecef)', // Мягкий градиентный фон
};

const imageStyle = {
    backgroundImage: `url('https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=1965&auto=format&fit=crop')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '400px', // Для мобильных устройств
    borderRadius: '15px 0 0 15px',
};

const Auth = observer(() => {
    const { user } = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE;

    // Состояния для полей формы
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [referrerCode, setReferrerCode] = useState(''); // Состояние для реферального кода

    // Обработчик клика по кнопке
    const click = async (e) => {
        e.preventDefault();
        try {
            let userData;
            if (isLogin) {
                userData = await login(email, password);
            } else {
                // Передаем все три поля при регистрации
                userData = await registration(email, password, referrerCode);
            }
            user.setUser(userData);
            user.setIsAuth(true);
            toast.success(`Добро пожаловать, ${userData.email}!`);
            navigate(SHOP_ROUTE);
        } catch (e) {
            toast.error(e.response?.data?.message || 'Произошла ошибка');
        }
    };

    return (
        <div style={pageStyle}>
            <Container>
                <Row className="justify-content-center">
                    <Col md={10} lg={8}>
                        <Card className="shadow-lg border-0" style={{ borderRadius: '15px' }}>
                            <Row className="g-0">
                                {/* Левая колонка с изображением (скрывается на маленьких экранах) */}
                                <Col md={6} className="d-none d-md-block" style={imageStyle}></Col>
                                
                                {/* Правая колонка с формой */}
                                <Col md={6}>
                                    <Card.Body className="p-4 p-lg-5">
                                        <h2 className="text-center mb-4 logo-font" style={{ color: '#2E7D32' }}>
                                            {isLogin ? 'Вход в аккаунт' : 'Создание аккаунта'}
                                        </h2>
                                        <Form onSubmit={click}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    placeholder="Введите ваш email..."
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Пароль</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="Введите пароль..."
                                                    value={password}
                                                    onChange={e => setPassword(e.target.value)}
                                                    required
                                                    minLength={6}
                                                />
                                            </Form.Group>

                                            {/* Поле для реферального кода (только на странице регистрации) */}
                                            {!isLogin && (
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Реферальный код (необязательно)</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Код от друга..."
                                                        value={referrerCode}
                                                        onChange={e => setReferrerCode(e.target.value)}
                                                    />
                                                </Form.Group>
                                            )}

                                            <div className="d-grid">
                                                <Button variant="success" type="submit" size="lg">
                                                    {isLogin ? 'Войти' : 'Зарегистрироваться'}
                                                </Button>
                                            </div>

                                            <div className="mt-4 text-center">
                                                {isLogin ? (
                                                    <div>
                                                        Нет аккаунта? <Link to={REGISTRATION_ROUTE}>Зарегистрируйтесь!</Link>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        Уже есть аккаунт? <Link to={LOGIN_ROUTE}>Войдите!</Link>
                                                    </div>
                                                )}
                                            </div>
                                        </Form>
                                    </Card.Body>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
});

export default Auth;