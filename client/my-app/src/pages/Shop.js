import React, { useContext, useEffect } from "react";
import { Container, Row, Col, Spinner, Dropdown } from "react-bootstrap"; // Добавили Dropdown
import TypeBar from "../components/TypeBar";
import ProductList from "../components/ProductList";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import Pages from "../components/Pages";
import PromoBanner from "../components/PromoBanner";
import SpecialOffers from "../components/SpecialOffers";

const Shop = observer(() => {
  const { product } = useContext(Context);

  // Опции для выпадающего списка сортировки
  const sortOptions = [
    { value: 'default', name: 'По популярности (новые)' },
    { value: 'price_asc', name: 'Сначала дешевые' },
    { value: 'price_desc', name: 'Сначала дорогие' },
  ];

  // Этот useEffect загружает данные, которые не зависят от фильтров.
  // Он сработает один раз при загрузке страницы.
  useEffect(() => {
    product.fetchTypesAction();
    product.fetchSpecialProductsAction();
  }, [product]);

  // Этот useEffect загружает основной каталог товаров.
  // Он будет реагировать на любые изменения в фильтрах, поиске, пагинации и сортировке.
  useEffect(() => {
    product.fetchProductsAction();
  }, [product, product.page, product.selectedType, product.searchQuery, product.sortBy]);

  // Обработчик для смены типа сортировки
  const handleSortChange = (sortValue) => {
    product.setSortBy(sortValue);
  };

  return (
    <Container className="mt-4">
      <PromoBanner />
      
      <SpecialOffers products={product.specialProducts} />
      
      <Row className="mt-4">
        <Col md={3}>
          <h4 className="mb-3">Категории</h4>
          <TypeBar />
        </Col>
        <Col md={9}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Наш Каталог</h2>

            {/* Выпадающий список для сортировки */}
            <Dropdown onSelect={handleSortChange}>
              <Dropdown.Toggle variant="outline-secondary" id="dropdown-sort">
                {/* Находим и отображаем имя текущей выбранной сортировки */}
                {sortOptions.find(opt => opt.value === product.sortBy)?.name || 'Сортировка'}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {sortOptions.map(opt => (
                  <Dropdown.Item key={opt.value} eventKey={opt.value} active={product.sortBy === opt.value}>
                    {opt.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          
          {product.isLoading ? (
            <div className="text-center"><Spinner animation="border" /></div>
          ) : (
            <ProductList />
          )}
          
          <Pages />
        </Col>
      </Row>
    </Container>
  );
});

export default Shop;