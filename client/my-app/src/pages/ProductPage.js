import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Image, Card, Button, Spinner, Alert, Form } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { fetchOneProduct, addReview, fetchReviews } from '../http/productAPI';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import { toast } from 'react-toastify';
import StarRating from '../components/StarRating';
import ProductItem from '../components/ProductItem';
import { BsCheckCircleFill, BsXCircleFill } from 'react-icons/bs';

const ProductPage = observer(() => {
    const { product: productStore, basket, user } = useContext(Context);
    const { id } = useParams();

    // Состояния для текущего товара и его отзывов
    const [product, setProduct] = useState({ info: [] });
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Состояния для формы нового отзыва
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Загрузка данных о товаре и отзывах при монтировании или смене ID
    const loadData = () => {
        setLoading(true);
        Promise.all([
            fetchOneProduct(id),
            fetchReviews(id)
        ]).then(([productData, reviewsData]) => {
            setProduct(productData);
            setReviews(reviewsData);
        }).catch(e => {
            setError(e.response?.data?.message || 'Ошибка загрузки данных');
        }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(loadData, [id]);

    // Обработчик отправки отзыва
    const handleAddReview = async () => {
        if (rating === 0) {
            toast.error('Пожалуйста, поставьте оценку');
            return;
        }
        setIsSubmitting(true);
        try {
            await addReview({ productId: id, rate: rating, comment });
            toast.success('Спасибо за ваш отзыв!');
            setRating(0);
            setComment('');
            loadData(); // Перезагружаем данные, чтобы увидеть новый отзыв и рейтинг
        } catch (e) {
            toast.error(e.response?.data?.message || 'Ошибка при добавлении отзыва');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Фильтр для похожих товаров
    const similarProducts = productStore.products
        .filter(p => p.typeId === product.typeId && p.id !== product.id)
        .slice(0, 4);

    if (loading) return <Container className="d-flex justify-content-center mt-5"><Spinner animation="border" /></Container>;
    if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;

    return (
        <Container className="my-5">
            {/* --- Основная информация о товаре --- */}
            <Row>
                <Col md={5}>
                    <Image src={process.env.REACT_APP_API_URL + '/' + product.img} fluid rounded />
                </Col>
                <Col md={7}>
                    <h1>{product.name}</h1>
                    <div className="d-flex align-items-center my-3">
                        <StarRating rating={product.rating} />
                        <span className="ms-2 text-muted">({reviews.length} отзывов)</span>
                    </div>
                    <div className="d-flex align-items-baseline gap-3 my-4">
                        <div className={`display-4 ${product.oldPrice ? 'text-danger' : ''}`}>{product.price} ₽</div>
                        {product.oldPrice && <div className="display-6 text-muted text-decoration-line-through">{product.oldPrice} ₽</div>}
                    </div>
                    <div className="my-3 fs-5">
                        {product.quantity > 0 ? <span className="text-success fw-bold"><BsCheckCircleFill className="me-2" />В наличии</span> : <span className="text-muted fw-bold"><BsXCircleFill className="me-2" />Нет в наличии</span>}
                    </div>
                    <Button variant="success" size="lg" onClick={() => basket.addItem(product)} disabled={product.quantity === 0}>
                        {product.quantity > 0 ? 'Добавить в корзину' : 'Нет в наличии'}
                    </Button>
                    {product.info.length > 0 && <div className="mt-4"><h4>Характеристики</h4><ul className="list-group list-group-flush">{product.info.map(i => <li key={i.id} className="list-group-item px-0 d-flex justify-content-between"><span>{i.title}</span><strong>{i.description}</strong></li>)}</ul></div>}
                </Col>
            </Row>

            {/* --- Секция с отзывами --- */}
            <div className="my-5">
                <hr />
                <h3 className="my-4">Отзывы о товаре</h3>
                <Row>
                    <Col md={7}>
                        {reviews.length > 0 ? (
                            reviews.map(review => (
                                <Card key={review.id} className="mb-3">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between">
                                            <strong>{review.user?.email || 'Аноним'}</strong>
                                            <StarRating rating={review.rate} />
                                        </div>
                                        <p className="mt-2 mb-0">{review.comment}</p>
                                    </Card.Body>
                                </Card>
                            ))
                        ) : <p>Отзывов пока нет. Будьте первым!</p>}
                    </Col>
                    {user.isAuth && (
                        <Col md={5}>
                            <h4>Оставить отзыв</h4>
                            <Form>
                                <Form.Group className="mb-2">
                                    <Form.Label>Ваша оценка:</Form.Label>
                                    <StarRating rating={rating} setRating={setRating} interactive />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ваш комментарий:</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={3} 
                                        value={comment} 
                                        onChange={e => setComment(e.target.value)} 
                                    />
                                </Form.Group>
                                <Button 
                                    variant="primary" 
                                    onClick={handleAddReview} 
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
                                </Button>
                            </Form>
                        </Col>
                    )}
                </Row>
            </div>

            {/* --- Секция с похожими товарами --- */}
            {similarProducts.length > 0 && (
                <div className="my-5">
                    <hr />
                    <h3 className="mb-4">Похожие товары</h3>
                    <Row xs={1} md={2} lg={4} className="g-4">
                        {similarProducts.map(p => <ProductItem key={p.id} product={p} />)}
                    </Row>
                </div>
            )}
        </Container>
    );
});

export default ProductPage;