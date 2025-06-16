// src/components/SpecialOffers.js
import React from 'react';
import { Row } from 'react-bootstrap';
import ProductItem from './ProductItem';

const SpecialOffers = ({ products }) => {
    if (!products || products.length === 0) {
        return null; // Если нет спецпредложений, ничего не показываем
    }

    return (
        <div className="my-5">
            <h2 className="mb-4 text-center">🔥 Предложения Недели 🔥</h2>
            <Row xs={1} md={2} lg={4} className="g-4">
                {products.map(p => (
                    <ProductItem key={p.id} product={p} />
                ))}
            </Row>
            <hr className="mt-5" />
        </div>
    );
};

export default SpecialOffers;