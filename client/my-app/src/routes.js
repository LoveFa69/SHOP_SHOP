import { 
    ADMIN_ROUTE, 
    BASKET_ROUTE, 
    LOGIN_ROUTE, 
    PRODUCT_ROUTE, 
    REGISTRATION_ROUTE, 
    SHOP_ROUTE,
    ORDERS_ROUTE,
    FAVORITES_ROUTE,
    PROFILE_ROUTE 
} from "./utils/consts";

// Импортируем все необходимые страницы
import Admin from "./pages/Admin";
import BasketPage from "./pages/BasketPage";
import Shop from "./pages/Shop";
import Auth from "./pages/Auth";
import ProductPage from "./pages/ProductPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import FavoritesPage from './pages/FavoritesPage';

// Маршруты, доступные только авторизованным пользователям
export const authRoutes = [
    { 
        path: ADMIN_ROUTE, 
        Component: Admin 
    },
    { 
        path: BASKET_ROUTE, 
        Component: BasketPage 
    },
    { 
        path: ORDERS_ROUTE, 
        Component: OrdersPage 
    },
    { 
        path: PROFILE_ROUTE, 
        Component: ProfilePage 
    },
    { path: ORDERS_ROUTE, 
        Component: OrdersPage
     },

    { path: FAVORITES_ROUTE,
         Component: FavoritesPage 
        },
];

// Маршруты, доступные всем пользователям
export const publicRoutes = [
    { 
        path: SHOP_ROUTE, 
        Component: Shop 
    },
    { 
        path: LOGIN_ROUTE, 
        Component: Auth 
    },
    { 
        path: REGISTRATION_ROUTE, 
        Component: Auth 
    },
    { 
        path: `${PRODUCT_ROUTE}/:id`, 
        Component: ProductPage 
    }
];