// components/modals/CreateType.js
import React, { useState, useContext } from "react";
import { Form, Modal, Button, Spinner } from "react-bootstrap";
import { Context } from "../../index";
import { observer } from "mobx-react-lite";
import { createType } from "../../http/productAPI"; // Импортируем напрямую

const CreateType = observer(({ show, onHide }) => {
    const { product } = useContext(Context); // Получаем стор продукта для обновления
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleClose = () => {
        setName('');
        setError('');
        onHide();
    };

    const addType = async () => {
        const trimmedName = name.trim();
        if (!trimmedName) {
            setError('Введите название типа');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            await createType({ name: trimmedName });
            setName('');
            await product.fetchTypesAction(); // Обновляем список типов в сторе
            handleClose();
        } catch (e) {
            const errorMessage = e.response?.data?.message || e.message || 'Ошибка';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Добавить новый тип</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* ... остальной код модалки не меняется ... */}
                    <Form.Control
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setError('');
                        }}
                        placeholder="Введите название типа"
                        isInvalid={!!error}
                        disabled={loading}
                    />
                    <Form.Control.Feedback type="invalid">
                        {error}
                    </Form.Control.Feedback>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={handleClose} disabled={loading}>
                    Закрыть
                </Button>
                <Button variant="success" onClick={addType} disabled={loading}>
                    {loading ? 'Добавление...' : 'Добавить'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateType;