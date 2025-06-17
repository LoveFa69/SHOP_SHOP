import React, { useContext, useState, useEffect } from 'react';
import { Form, Modal, Button, Dropdown, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';
import { createProduct } from '../../http/productAPI';
import { toast } from 'react-toastify';

const CreateProduct = observer(({ show, onHide }) => {
    const { product } = useContext(Context);

    // Состояния для полей формы
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [oldPrice, setOldPrice] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [unit, setUnit] = useState('шт.'); // Состояние для единиц измерения
    const [isSpecial, setIsSpecial] = useState(false);
    const [file, setFile] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [info, setInfo] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (show) {
            product.fetchTypesAction().catch(() => setError('Не удалось загрузить типы'));
        }
    }, [show, product]);

    const handleClose = () => {
        setName('');
        setPrice('');
        setOldPrice('');
        setQuantity(0);
        setUnit('шт.'); // Сброс единиц измерения
        setIsSpecial(false);
        setFile(null);
        setSelectedType(null);
        setInfo([]);
        setError('');
        onHide();
    };

    const addInfo = () => setInfo([...info, { title: '', description: '', number: Date.now() }]);
    const removeInfo = (number) => setInfo(info.filter(item => item.number !== number));
    const changeInfo = (key, value, number) => setInfo(info.map(i => (i.number === number ? { ...i, [key]: value } : i)));
    const selectFile = (e) => setFile(e.target.files[0]);

    const addProduct = async () => {
        if (!name.trim() || !price || !selectedType || !file) {
            setError('Заполните все обязательные поля: Название, Цена, Тип и Изображение.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('name', name.trim());
            formData.append('price', `${price}`);
            if (oldPrice) {
                formData.append('oldPrice', `${oldPrice}`);
            }
            formData.append('quantity', `${quantity}`);
            formData.append('isSpecial', isSpecial);
            formData.append('unit', unit); // Добавляем единицу измерения в formData
            formData.append('img', file);
            formData.append('typeId', selectedType.id);
            const validInfo = info.filter(i => i.title.trim() && i.description.trim());
            formData.append('info', JSON.stringify(validInfo));

            await createProduct(formData);
            
            await product.fetchProductsAction();
            await product.fetchSpecialProductsAction();

            toast.success('Продукт успешно добавлен!');
            handleClose();

        } catch (e) {
            const errorMessage = e.response?.data?.message || 'Произошла ошибка при создании продукта';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton><Modal.Title>Добавить новый продукт</Modal.Title></Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form>
                    <Row>
                        <Col md={6} className="mb-3"><Dropdown><Dropdown.Toggle variant="outline-dark" className="w-100">{selectedType ? selectedType.name : 'Выберите тип'}</Dropdown.Toggle><Dropdown.Menu className="w-100">{product.types.map(type => <Dropdown.Item key={type.id} onClick={() => setSelectedType(type)}>{type.name}</Dropdown.Item>)}</Dropdown.Menu></Dropdown></Col>
                        <Col md={6} className="mb-3"><Form.Control type="file" onChange={selectFile} /></Col>
                    </Row>
                    <Form.Group className="mb-3"><Form.Label>Название продукта</Form.Label><Form.Control placeholder="Введите название..." value={name} onChange={e => setName(e.target.value)} /></Form.Group>
                    
                    <Row>
                        <Col md={8}>
                            <Form.Group className="mb-3"><Form.Label>Количество на складе</Form.Label><Form.Control type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value) || 0)} min={0} /></Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3"><Form.Label>Ед. изм.</Form.Label><Form.Control placeholder="шт / кг / л" value={unit} onChange={e => setUnit(e.target.value)} /></Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Текущая цена</Form.Label><Form.Control placeholder="Например, 99" type="number" value={price} onChange={e => setPrice(Number(e.target.value) || '')} required /></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Старая цена (без скидки)</Form.Label><Form.Control placeholder="Необязательно" type="number" value={oldPrice} onChange={e => setOldPrice(Number(e.target.value) || '')} /></Form.Group></Col>
                    </Row>
                    <hr />
                    <Form.Check type="switch" id="special-switch" label="Сделать специальным предложением" checked={isSpecial} onChange={e => setIsSpecial(e.target.checked)} className="mb-3" />
                    <Button variant="outline-info" onClick={addInfo}>Добавить характеристику</Button>
                    {info.map(i => <Row key={i.number} className="mt-3"><Col md={5}><Form.Control placeholder="Название" value={i.title} onChange={e => changeInfo('title', e.target.value, i.number)} /></Col><Col md={5}><Form.Control placeholder="Описание" value={i.description} onChange={e => changeInfo('description', e.target.value, i.number)} /></Col><Col md={2}><Button variant="outline-danger" onClick={() => removeInfo(i.number)}>Удалить</Button></Col></Row>)}
                </Form>
            </Modal.Body>
            <Modal.Footer><Button variant="outline-secondary" onClick={handleClose}>Отмена</Button><Button variant="success" onClick={addProduct} disabled={loading}>{loading ? <Spinner as="span" animation="border" size="sm" /> : 'Добавить'}</Button></Modal.Footer>
        </Modal>
    );
});

export default CreateProduct;