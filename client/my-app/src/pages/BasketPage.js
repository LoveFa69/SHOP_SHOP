import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { Container, Row, Col, Card, Button, Image, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createOrder } from '../http/orderAPI'; // Импортируем новую функцию

const BasketPage = observer(() => {
    const { basket, user } = useContext(Context);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleOrder = async () => {
        if (!user.isAuth) {
            toast.error('Для оформления заказа необходимо авторизоваться');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                items: basket.items.map(item => ({ // Отправляем только нужные данные
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
                totalPrice: basket.total,
            };
            await createOrder(orderData);
            
            setLoading(false);
            basket.clearBasket();
            toast.success('Спасибо! Ваш заказ принят в обработку.');
            navigate('/orders'); // Перебрасываем на страницу истории заказов
        } catch (e) {
            setLoading(false);
            toast.error(e.response?.data?.message || 'Ошибка оформления заказа');
        }
    };

    const handleQuantityChange = (id, newQuantity) => {
        basket.updateQuantity(id, newQuantity);
    };

    if (basket.items.length === 0 && !loading) {
        return (
            <Container className="text-center mt-5">
                <Alert variant="secondary">
                    <Alert.Heading>Ваша корзина пуста</Alert.Heading>
                    <p>Самое время начать покупки!</p>
                    <hr />
                    <Link to="/"><Button variant="success">Перейти в каталог</Button></Link>
                </Alert>
            </Container>
        );
    }
    
    return (
        <Container className="mt-4">
            <h2 className="mb-4">Моя корзина</h2>
            <Row>
                <Col md={8}>
                    {basket.items.map(item => (
                        <Card key={item.id} className="mb-3 shadow-sm border-0">
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col xs={3} md={2}><Image src={process.env.REACT_APP_API_URL + '/' + item.img} alt={item.name} thumbnail fluid /></Col>
                                    <Col xs={9} md={4}><h5>{item.name}</h5><span className="text-muted">{item.price} ₽ / шт.</span></Col>
                                    <Col xs={7} md={3} className="d-flex align-items-center justify-content-center mt-2 mt-md-0"><Button variant="outline-secondary" size="sm" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</Button><span className="mx-3 fw-bold">{item.quantity}</span><Button variant="outline-secondary" size="sm" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</Button></Col>
                                    <Col xs={3} md={2} className="text-center fw-bold mt-2 mt-md-0"><span>{(item.price * item.quantity).toFixed(2)} ₽</span></Col>
                                    <Col xs={2} md={1} className="text-end mt-2 mt-md-0"><Button variant="outline-danger" size="sm" onClick={() => basket.removeItem(item.id)}>×</Button></Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
                </Col>
                <Col md={4}>
                    <Card className="shadow-sm border-0">
                        <Card.Body>
                            <Card.Title as="h4">Итого</Card.Title>
                            <div className="d-flex justify-content-between mt-3"><span>{basket.totalItems} товар(а)</span><span>{basket.total} ₽</span></div>
                            <hr />
                            <div className="d-flex justify-content-between fw-bold fs-5"><span>Общая стоимость</span><span>{basket.total} ₽</span></div>
                            <div className="d-grid mt-4">
                                <Button variant="success" size="lg" onClick={handleOrder} disabled={loading}>{loading ? <><Spinner as="span" animation="border" size="sm" />{' Оформление...'}</> : 'Оформить заказ'}</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
});

export default BasketPage;