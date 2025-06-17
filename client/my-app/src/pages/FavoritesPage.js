import React, { useEffect, useState } from 'react';
import { Container, Row, Spinner, Alert } from 'react-bootstrap';
import { fetchFavorites } from '../http/favoritesAPI';
import ProductItem from '../components/ProductItem';

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavorites()
            .then(data => setFavorites(data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Container className="d-flex justify-content-center mt-5"><Spinner animation="border" /></Container>;

    return (
        <Container className="my-5">
            <h2 className="mb-4">Избранные товары</h2>
            {favorites.length > 0 ? (
                <Row xs={1} md={2} lg={4} className="g-4">
                    {favorites.map(product => (
                        <ProductItem key={product.id} product={product} />
                    ))}
                </Row>
            ) : (
                <Alert variant="info">Ваш список избранного пуст.</Alert>
            )}
        </Container>
    );
};

export default FavoritesPage;