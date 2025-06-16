import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import ReferralModal from '../components/modals/ReferralModal'; // Импортируем модальное окно
import './PromoBanner.css';

const PromoBanner = () => {
    // Состояние для управления видимостью модального окна
    const [modalShow, setModalShow] = useState(false);

    return (
        <>
            <Card className="promo-banner my-4 text-white">
                <Card.Img 
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop" 
                    alt="Продукты" 
                    className="promo-banner-img"
                />
                <Card.ImgOverlay className="d-flex flex-column justify-content-center align-items-start p-5">
                    <Card.Title as="h1" className="promo-title">Скидка 15% за друга!</Card.Title>
                    <Card.Text className="promo-text my-3">
                        Пригласите друга в наш магазин, и вы оба получите <br />
                        скидку на следующий заказ.
                    </Card.Text>
                    {/* По клику открываем модальное окно */}
                    <Button variant="light" size="lg" onClick={() => setModalShow(true)}>
                        Узнать больше
                    </Button>
                </Card.ImgOverlay>
            </Card>

            {/* Наше модальное окно, которое будет показано, когда modalShow === true */}
            <ReferralModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </>
    );
};

export default PromoBanner;