import React, { useContext } from "react";
import { Navbar, Container, Nav, Button, Badge, Form, NavDropdown } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { Context } from "../index";
import { ADMIN_ROUTE, LOGIN_ROUTE, SHOP_ROUTE, BASKET_ROUTE, ORDERS_ROUTE, PROFILE_ROUTE } from "../utils/consts";
import { observer } from "mobx-react-lite";
import { FaShoppingCart, FaSearch, FaUserCircle } from "react-icons/fa";

const NavBar = observer(() => {
    const { user, basket, product } = useContext(Context);
    const navigate = useNavigate();

    const logOut = () => {
        user.setUser({});
        user.setIsAuth(false);
        localStorage.removeItem('token');
        basket.clearBasket();
        navigate(LOGIN_ROUTE);
    };

    const isAdmin = user.isAuth && user.user?.role === 'ADMIN';

    const handleSearch = (e) => {
        product.setSearchQuery(e.target.value);
        if (window.location.pathname !== SHOP_ROUTE) {
            navigate(SHOP_ROUTE);
        }
    };

    return (
        <Navbar 
            variant="dark" 
            expand="lg" 
            className="navbar-custom-green shadow-sm"
            sticky="top"
        >
            <Container>
                <Navbar.Brand as={NavLink} to={SHOP_ROUTE} className="logo-font">
                    Универсал
                </Navbar.Brand>
                
                <Form className="d-flex search-form mx-auto">
                    <FaSearch className="search-icon" />
                    <Form.Control
                        type="search"
                        placeholder="Найти продукты..."
                        className="me-2 search-input"
                        aria-label="Search"
                        value={product.searchQuery}
                        onChange={handleSearch}
                    />
                </Form>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center gap-3">
                        <Button variant="light" onClick={() => navigate(BASKET_ROUTE)} className="d-flex align-items-center">
                            <FaShoppingCart className="me-2" />
                            Корзина
                            {basket.totalItems > 0 && (
                                <Badge pill bg="danger" className="ms-2">{basket.totalItems}</Badge>
                            )}
                        </Button>
                        {user.isAuth ? (
                            <NavDropdown title={<FaUserCircle size={24} />} id="basic-nav-dropdown" align="end">
                                <NavDropdown.Item onClick={() => navigate(PROFILE_ROUTE)}>Личный кабинет</NavDropdown.Item>
                                {isAdmin && <NavDropdown.Item onClick={() => navigate(ADMIN_ROUTE)}>Админ-панель</NavDropdown.Item>}
                                <NavDropdown.Item onClick={() => navigate(ORDERS_ROUTE)}>Мои заказы</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => navigate(FAVORITES_ROUTE)}>Избранное</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={logOut}>Выйти</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <Button variant="light" onClick={() => navigate(LOGIN_ROUTE)}>
                                Войти
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
});

export default NavBar;