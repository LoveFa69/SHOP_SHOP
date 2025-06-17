// src/components/Footer.js

import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaVk, FaTelegramPlane } from 'react-icons/fa'; // Иконки соцсетей
import './Footer.css'; // Стили для футера

const Footer = () => {
    return (
        <footer className="footer-container mt-auto">
            <Container>
                <Row className="py-5">
                    {/* --- Колонка с лого и описанием --- */}
                    <Col md={4} className="mb-4 mb-md-0">
                        <h4 className="logo-font">Универсал</h4>
                        <p className="footer-text">
                            Свежие продукты с доставкой на дом. Качество, проверенное временем.
                        </p>
                    </Col>

                    {/* --- Колонка с навигацией --- */}
                    <Col md={2} className="mb-4 mb-md-0">
                        <h5>Навигация</h5>
                        <Nav className="flex-column">
                            <Nav.Link as={Link} to="/" className="footer-link p-0">Главная</Nav.Link>
                            <Nav.Link as={Link} to="/" className="footer-link p-0">Каталог</Nav.Link>
                            <Nav.Link href="#" className="footer-link p-0">Акции</Nav.Link>
                        </Nav>
                    </Col>
                    
                    {/* --- Колонка с контактами --- */}
                    <Col md={3} className="mb-4 mb-md-0">
                        <h5>Связь с нами</h5>
                        <ul className="list-unstyled">
                            <li><a href="mailto:unifersal@gmail.com" className="footer-link">unifersal@gmail.com</a></li>
                            <li><a href="tel:+79991234567" className="footer-link">+7 (904) 148-32-36</a></li>
                        </ul>
                    </Col>

                    {/* --- Колонка с соцсетями --- */}
                    <Col md={3}>
                        <h5>Мы в соцсетях</h5>
                        <div className="social-icons">
                            <a href="https://vk.com/club225184871" target="_blank" rel="noopener noreferrer" className="social-icon">
                                <FaVk size={24} />
                            </a>
                            <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="social-icon">
                                <FaTelegramPlane size={24} />
                            </a>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center py-3 footer-bottom">
                        © {new Date().getFullYear()} Универсал. Все права защищены.
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;