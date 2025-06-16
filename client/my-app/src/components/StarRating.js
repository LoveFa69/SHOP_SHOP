// src/components/StarRating.js

import React from 'react';
// Импортируем три иконки: целую, пустую и половинчатую
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

// --- Новый, улучшенный компонент ---
const StarRating = ({ rating = 0, setRating, interactive = false }) => {
    return (
        <div className="d-flex align-items-center">
            {[...Array(5)].map((star, i) => {
                const ratingValue = i + 1;

                // --- Логика для интерактивных звезд (форма отзыва) ---
                if (interactive) {
                    return (
                        <label key={i}>
                            <input
                                type="radio"
                                name="rating"
                                value={ratingValue}
                                onClick={() => setRating(ratingValue)}
                                style={{ display: 'none' }}
                            />
                            <FaStar
                                size={22}
                                color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
                                style={{ cursor: 'pointer', marginRight: '2px' }}
                            />
                        </label>
                    );
                }

                // --- Логика для отображения дробного рейтинга (не интерактивная) ---
                return (
                    <span key={i} style={{ marginRight: '2px' }}>
                        {rating >= ratingValue 
                            ? <FaStar color="#ffc107" size={20} /> // Полная звезда
                            : rating >= ratingValue - 0.5 
                            ? <FaStarHalfAlt color="#ffc107" size={20} /> // Половинчатая звезда
                            : <FaRegStar color="#e4e5e9" size={20} /> // Пустая звезда
                        }
                    </span>
                );
            })}
        </div>
    );
};

export default StarRating;