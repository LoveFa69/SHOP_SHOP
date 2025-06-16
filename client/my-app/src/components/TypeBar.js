import React, { useContext } from "react";
import { Context } from "..";
import { ListGroup } from 'react-bootstrap';
import { observer } from "mobx-react-lite";
import { BsCardList, BsGridFill } from "react-icons/bs"; // Импортируем иконки
import './TypeBar.css'; // Подключаем наши новые стили

const TypeBar = observer(() => {
    const { product } = useContext(Context);

    const selectType = (type) => {
        // Если кликаем на уже активный тип, сбрасываем фильтр (возвращаемся к "Все типы")
        if (type && product.selectedType && type.id === product.selectedType.id) {
            product.setSelectedType({});
        } else {
            product.setSelectedType(type || {});
        }
    };

    return (
        <ListGroup className="typebar-container">
            {/* --- Пункт "Все типы" --- */}
            <ListGroup.Item
                action // Добавляет эффект при наведении и клике
                className="typebar-item"
                active={!product.selectedType?.id}
                onClick={() => selectType(null)}
            >
                 <BsGridFill className="typebar-icon" />
                Все типы
            </ListGroup.Item>
            
            {/* --- Список остальных типов --- */}
            {product.types.map(type =>
                <ListGroup.Item
                    action
                    className="typebar-item"
                    active={type.id === product.selectedType?.id}
                    onClick={() => selectType(type)}
                    key={type.id}
                >
                    <BsCardList className="typebar-icon" />
                    {type.name}
                </ListGroup.Item>
            )}
        </ListGroup>
    );
});

export default TypeBar;