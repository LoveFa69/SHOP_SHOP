import React, { useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { BsFillChatDotsFill, BsX } from 'react-icons/bs'; // Импортируем иконку крестика
import { sendSupportMessage } from '../http/userAPI';
import { toast } from 'react-toastify';
import './SupportWidget.css'; // Подключаем наши новые стили

const SupportWidget = () => {
    // Меняем 'show' на 'isOpen' для большей ясности
    const [isOpen, setIsOpen] = useState(false); 
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Функция для переключения состояния открыт/закрыт
    const toggleWidget = () => setIsOpen(!isOpen);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await sendSupportMessage({ name, email, message });
            toast.success('Сообщение отправлено!');
            setIsOpen(false); // Закрываем виджет после успеха
            // Очищаем поля
            setName('');
            setEmail('');
            setMessage('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Ошибка отправки');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Наша новая форма, которая будет выезжать */}
            <div className={`support-widget-form ${isOpen ? 'is-open' : ''}`}>
                <div className="widget-header">
                    <h5>Связаться с нами</h5>
                    <button className="widget-close-btn" onClick={() => setIsOpen(false)}>×</button>
                </div>
                <div className="widget-body">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-2">
                            <Form.Label>Ваше имя</Form.Label>
                            <Form.Control size="sm" type="text" value={name} onChange={e => setName(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Ваш Email</Form.Label>
                            <Form.Control size="sm" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Сообщение</Form.Label>
                            <Form.Control as="textarea" rows={4} value={message} onChange={e => setMessage(e.target.value)} required />
                        </Form.Group>
                        <Button variant="success" type="submit" disabled={loading} className="w-100">
                            {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Отправить'}
                        </Button>
                    </Form>
                </div>
            </div>

            {/* Кнопка-триггер, которая всегда на виду */}
            <Button variant="success" className="support-widget-button" onClick={toggleWidget}>
                {/* Меняем иконку в зависимости от состояния */}
                {isOpen ? <BsX size={28} /> : <BsFillChatDotsFill size={24} />}
            </Button>
        </>
    );
};

export default SupportWidget;