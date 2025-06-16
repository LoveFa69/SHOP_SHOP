import React, { useContext, useEffect } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import TypeBar from "../components/TypeBar";
import ProductList from "../components/ProductList";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import Pages from "../components/Pages";
import PromoBanner from "../components/PromoBanner";
import SpecialOffers from "../components/SpecialOffers";

const Shop = observer(() => {
  const { product } = useContext(Context);

  // --- ЕДИНЫЙ, ГЛАВНЫЙ useEffect ДЛЯ ЗАГРУЗКИ ВСЕХ ДАННЫХ ---
  useEffect(() => {
    // Этот эффект будет срабатывать при ПЕРВОЙ загрузке страницы
    // и при ЛЮБОМ изменении фильтров (тип, поиск, страница).

    // Загружаем типы и спецпредложения. Они не зависят от фильтров,
    // но мы их все равно включаем в этот хук для согласованности.
    product.fetchTypesAction();
    product.fetchSpecialProductsAction();
    
    // Загружаем основной каталог с учетом всех фильтров.
    product.fetchProductsAction();

  }, [product, product.page, product.selectedType, product.searchQuery]); // Следим за всеми зависимостями

  return (
    <Container className="mt-4">
      <PromoBanner />
      
      {/* 
        Теперь компонент SpecialOffers будет получать обновленные данные 
        из product.specialProducts, как только они загрузятся.
      */}
      <SpecialOffers products={product.specialProducts} />
      
      <Row className="mt-4">
        <Col md={3}>
          <h4 className="mb-3">Категории</h4>
          <TypeBar />
        </Col>
        <Col md={9}>
          <h2 className="mb-4">Наш Каталог</h2>
          {/* 
            Компонент ProductList также будет автоматически обновляться, 
            когда изменятся данные в product.products.
          */}
          {product.isLoading ? <Spinner animation="border" /> : <ProductList />}
          <Pages />
        </Col>
      </Row>
    </Container>
  );
});

export default Shop;