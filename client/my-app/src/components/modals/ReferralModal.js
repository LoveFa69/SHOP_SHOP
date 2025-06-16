// src/components/modals/ReferralModal.js

import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaGift } from 'react-icons/fa';

const ReferralModal = ({ show, onHide }) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <FaGift className="me-2" style={{ color: '#2E7D32' }} />
                    Пригласи друга — получи скидку!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Поделитесь вашим уникальным реферальным кодом с друзьями. Когда ваш друг зарегистрируется и сделает свой первый заказ, вы оба получите <strong>скидку 15%</strong> на следующую покупку!</p>
                <h5 className="mt-4">Как это работает?</h5>
                <ol>
                    <li>Найдите свой реферальный код в личном кабинете.</li>
                    <li>Отправьте его другу.</li>
                    <li>Ваш друг должен будет ввести этот код при регистрации.</li>
                    <li>После его первого заказа промокод на скидку появится в ваших личных кабинетах.</li>
                </ol>
                <p className="text-muted small mt-4">
                    Подробные условия акции читайте в разделе "Правила и условия".
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={onHide}>
                    Понятно!
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ReferralModal;