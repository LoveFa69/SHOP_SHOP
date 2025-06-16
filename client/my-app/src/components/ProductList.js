import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '..';
import { Row } from 'react-bootstrap';
import ProductItem from './ProductItem';

const ProductList = observer(() => {
    const { product } = useContext(Context);

    return (
        <Row xs={1} md={2} lg={4} className="g-4">
            {product.products.map(p => (
                <ProductItem key={p.id} product={p} />
            ))}
        </Row>
    );
});

export default ProductList;