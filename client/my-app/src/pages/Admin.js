import React, { useState, useContext, useEffect } from 'react';
import { Button, Container, Tabs, Tab, ListGroup, Table, Image, Row, Col } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { Context } from '..';
import CreateType from '../components/modals/CreateType';
import CreateProduct from '../components/modals/CreateProduct';
import Pages from '../components/Pages';
import { deleteType, deleteProduct } from '../http/productAPI';
import { toast } from 'react-toastify';
const Admin = observer(() => {
    const { product } = useContext(Context);
    const [typeVisible, setTypeVisible] = useState(false);
    const [productVisible, setProductVisible] = useState(false);
    // Загружаем данные при монтировании компонента
    useEffect(() => {
        product.fetchTypesAction();
        product.fetchProductsAction();
    }, [product]);  
    // Обновляем список товаров при смене страницы
    useEffect(() => {
        product.fetchProductsAction();
    }, [product.page]);
    const handleDeleteType = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот тип?')) {
            try {
                await deleteType(id);
                toast.success('Тип успешно удален');
                product.fetchTypesAction(); // Обновляем список
            } catch (e) {
                toast.error(e.response?.data?.message || 'Ошибка удаления');
            }
        }
    };
    const handleDeleteProduct = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
            try {
                await deleteProduct(id);
                toast.success('Товар успешно удален');
                product.fetchProductsAction(); // Обновляем список
            } catch (e) {
                toast.error(e.response?.data?.message || 'Ошибка удаления');
            }
        }
    };
    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">Административная панель</h2>

            <Tabs defaultActiveKey="products" id="admin-tabs" className="mb-3" fill>
                <Tab eventKey="products" title="Управление товарами">
                    <div className="d-flex justify-content-end my-3">
                        <Button variant="success" onClick={() => setProductVisible(true)}>
                            Добавить товар
                        </Button>
                    </div>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Изображение</th>
                                <th>Название</th>
                                <th>Цена</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {product.products.map(item => (
                                <tr key={item.id} className="align-middle">
                                    <td>{item.id}</td>
                                    <td>
                                        <Image src={process.env.REACT_APP_API_URL + '/' + item.img} width={60} thumbnail />
                                    </td>
                                    <td>{item.name}</td>
                                    <td>{item.price} ₽</td>
                                    <td>
                                        <Button variant="danger" size="sm" onClick={() => handleDeleteProduct(item.id)}>
                                            Удалить
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Pages />
                </Tab>
                <Tab eventKey="types" title="Управление типами">
                    <div className="d-flex justify-content-end my-3">
                        <Button variant="primary" onClick={() => setTypeVisible(true)}>
                            Добавить тип
                        </Button>
                    </div>
                    <ListGroup>
                        {product.types.map(type => (
                            <ListGroup.Item key={type.id}>
                                <Row className="align-items-center">
                                    <Col><h5>{type.name}</h5></Col>
                                    <Col xs="auto">
                                        <Button variant="danger" size="sm" onClick={() => handleDeleteType(type.id)}>
                                            Удалить
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Tab>
            </Tabs>
            <CreateType show={typeVisible} onHide={() => setTypeVisible(false)} />
            <CreateProduct show={productVisible} onHide={() => setProductVisible(false)} />
        </Container>
    );
});

export default Admin;