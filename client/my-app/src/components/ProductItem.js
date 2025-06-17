import React, { useContext } from 'react';
import { Card, Col, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PRODUCT_ROUTE } from '../utils/consts';
import StarRating from './StarRating';
import './ProductItem.css';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Иконки для избранного
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import { toast } from 'react-toastify';

const ProductItem = observer(({ product }) => {
    const { favorites, user } = useContext(Context);
    const imageUrl = process.env.REACT_APP_API_URL + '/' + product.img;
    const placeholderImage = "data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";

    const discountPercent = product.oldPrice
        ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
        : 0;
        
    // Обработчик для клика по иконке избранного
    const handleFavoriteClick = (e) => {
        e.preventDefault(); // Предотвращаем переход на страницу товара
        e.stopPropagation(); // Останавливаем всплытие события
        if (!user.isAuth) {
            return toast.info('Войдите, чтобы добавлять товары в избранное');
        }
        favorites.toggleFavoriteAction(product.id);
    };

    return (
        <Col>
            <Link 
                to={`${PRODUCT_ROUTE}/${product.id}`} 
                className={`text-decoration-none text-dark ${product.quantity === 0 ? 'pe-none' : ''}`}
            >
                <Card className={`product-card h-100 position-relative ${product.quantity === 0 ? 'out-of-stock' : ''}`}>
                    {/* Кнопка добавления в избранное */}
                    <Button variant="light" className="favorite-btn" onClick={handleFavoriteClick}>
                        {favorites.isFavorite(product.id) ? <FaHeart color="red" /> : <FaRegHeart />}
                    </Button>

                    {product.oldPrice && (
                        <Badge bg="danger" className="position-absolute top-0 start-0 m-2" style={{ zIndex: 1 }}>
                            -{discountPercent}%
                        </Badge>
                    )}

                    <Card.Img
                        variant="top"
                        src={imageUrl}
                        className="product-card-img"
                        onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }}
                    />
                    <Card.Body className="d-flex flex-column p-3">
                        <Card.Title className="product-title mb-2">{product.name}</Card.Title>
                        <div className="mb-2">
                            {product.quantity > 0 ? (
                                <Badge pill bg="success" className="fw-normal">В наличии</Badge>
                            ) : (
                                <Badge pill bg="secondary" className="fw-normal">Нет в наличии</Badge>
                            )}
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                <div className={`fw-bold fs-5 ${product.oldPrice ? 'text-danger' : ''}`}>{product.price} ₽</div>
                                {product.oldPrice && (<div className="text-muted text-decoration-line-through small">{product.oldPrice} ₽</div>)}
                            </div>
                            {product.rating > 0 && (
                                <div className="d-flex align-items-center">
                                    <StarRating rating={product.rating} />
                                    <span className="ms-2 text-muted small">({product.rating})</span>
                                </div>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            </Link>
        </Col>
    );
});

export default ProductItem;