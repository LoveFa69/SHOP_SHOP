import React, { useEffect, useState } from 'react';
import { Container, Accordion, Card, Row, Col, Image, Spinner, Alert, Badge } from 'react-bootstrap';
import { fetchOrders } from '../http/orderAPI';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrders()
            .then(data => setOrders(data))
            .catch(e => setError(e.response?.data?.message || 'Не удалось загрузить историю заказов'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Container className="d-flex justify-content-center mt-5"><Spinner animation="border" /></Container>;
    if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;

    return (
        <Container className="my-5">
            <h2 className="mb-4">Моя история заказов</h2>
            {orders.length > 0 ? (
                <Accordion defaultActiveKey="0">
                    {orders.map((order, index) => (
                        <Accordion.Item eventKey={index.toString()} key={order.id}>
                            <Accordion.Header>
                                <div className="d-flex justify-content-between w-100 pe-3">
                                    <span>Заказ №{order.id} от {format(new Date(order.createdAt), 'd MMMM yyyy, HH:mm', { locale: ru })}</span>
                                    <Badge bg="info">{order.status}</Badge>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                {order.products.map(productItem => (
                                    <Card key={productItem.id} className="mb-2">
                                        <Card.Body>
                                            <Row className="align-items-center">
                                                <Col xs={3} md={2}>
                                                    <Image src={process.env.REACT_APP_API_URL + '/' + productItem.img} thumbnail fluid />
                                                </Col>
                                                <Col xs={9} md={5}>
                                                    <h5>{productItem.name}</h5>
                                                </Col>
                                                <Col xs={6} md={2}>
                                                    {productItem.order_product.quantity} шт.
                                                </Col>
                                                <Col xs={6} md={3} className="text-end">
                                                    <strong>{(productItem.order_product.price * productItem.order_product.quantity).toFixed(2)} ₽</strong>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                ))}
                                <div className="text-end mt-3">
                                    <h4>Итого: {order.totalPrice.toFixed(2)} ₽</h4>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            ) : (
                <Alert variant="info">У вас пока нет ни одного заказа.</Alert>
            )}
        </Container>
    );
};

export default OrdersPage;