import React from 'react';
import { Card, Col, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PRODUCT_ROUTE } from '../utils/consts';
import StarRating from './StarRating';
import './ProductItem.css';

const ProductItem = ({ product }) => {
    const imageUrl = process.env.REACT_APP_API_URL + '/' + product.img;
    const placeholderImage = "data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";

    // Расчет процента скидки
    const discountPercent = product.oldPrice
        ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
        : 0;

    return (
        <Col>
            <Link 
                to={`${PRODUCT_ROUTE}/${product.id}`} 
                className={`text-decoration-none text-dark ${product.quantity === 0 ? 'pe-none' : ''}`}
                // pe-none (pointer-events: none) делает ссылку некликабельной, если товара нет
            >
                <Card className={`product-card h-100 position-relative ${product.quantity === 0 ? 'out-of-stock' : ''}`}>
                    {/* Бейдж со скидкой, если есть старая цена */}
                    {product.oldPrice && (
                        <Badge 
                            bg="danger" 
                            className="position-absolute top-0 start-0 m-2"
                            style={{ zIndex: 1 }}
                        >
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
                        
                        {/* Статус наличия товара */}
                        <div className="mb-2">
                            {product.quantity > 0 ? (
                                <Badge pill bg="success" className="fw-normal">В наличии</Badge>
                            ) : (
                                <Badge pill bg="secondary" className="fw-normal">Нет в наличии</Badge>
                            )}
                        </div>

                        <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                <div className={`fw-bold fs-5 ${product.oldPrice ? 'text-danger' : ''}`}>
                                    {product.price} ₽
                                </div>
                                {product.oldPrice && (
                                    <div className="text-muted text-decoration-line-through small">
                                        {product.oldPrice} ₽
                                    </div>
                                )}
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
};

export default ProductItem;