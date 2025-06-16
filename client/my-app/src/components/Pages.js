// src/components/Pages.js

import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { Pagination } from 'react-bootstrap';

const Pages = observer(() => {
    const { product } = useContext(Context);
    
    // Считаем общее количество страниц
    const pageCount = Math.ceil(product.totalCount / product.limit);
    
    // Создаем массив номеров страниц для отображения
    const pages = [];
    for (let i = 0; i < pageCount; i++) {
        pages.push(i + 1);
    }

    // Если страница всего одна, не показываем пагинацию
    if (pageCount <= 1) {
        return null;
    }

    return (
        <Pagination className="mt-5 d-flex justify-content-center">
            {pages.map(page =>
                <Pagination.Item
                    key={page}
                    active={product.page === page}
                    onClick={() => product.setPage(page)}
                >
                    {page}
                </Pagination.Item>
            )}
        </Pagination>
    );
});

export default Pages;