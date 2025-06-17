import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStore from './store/UserStore';
import ProductStore from './store/ProductStore';
import TypeStore from './store/TypeStore';
import basketStore from './store/BasketStore';
import favoritesStore from './store/FavoritesStore'; // Импорт

export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Context.Provider value={{
    user: new UserStore(),
    product: new ProductStore(),
    type: new TypeStore(),
    basket: basketStore,
    favorites: favoritesStore, // Добавляем в контекст
  }}>
    <App />
  </Context.Provider>
);