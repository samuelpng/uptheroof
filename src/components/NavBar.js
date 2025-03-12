
import { useContext, useEffect, useState, Fragment } from 'react';
import { Container, Form, FormControl, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaShoppingCart } from "react-icons/fa";
import CategoriesContext from '../contexts/CategoriesContext';
import SportsContext from '../contexts/SportsContext';

export default function NavBar() {

    const { sports, sportsLoading, sportsError } = useContext(SportsContext);
    const { categories, categoriesLoading, categoriesError } = useContext(CategoriesContext);

    const [loggedIn, setLoggedIn] = useState(false)

    const { user, logout, isLoading } = useAuth();
    const handleLogout = async () => {
        await logout()
    }

    useEffect(() => {
        console.log("user", user);
        if (user) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      }, [user]); 

    
    return (
        <Fragment>
            <div className="top-bar">
    <div className="top-bar-container">
        {/* Logo */}
        <a href="/" className="logo">
            <img src="/images/sports-engineering-logo.png" alt="Company Logo" />
        </a>

        {/* Search Bar (Moves below logo on mobile) */}
        <form className="search-bar">
            <input type="text" placeholder="Search our catalog" />
        </form>

        {/* Account & Cart Icons */}
        <div className="icons">
            <a href="/account" className="icon">👤</a>
            <a href="/cart" className="icon">🛒 <span className="cart-count">0</span></a>
        </div>
    </div>
</div>

            <Navbar expand="lg" sticky="top" className="lg-navbar orange-navbar">
                <Container>
                    {/* <Navbar.Brand href="/" className="ms-2"><img src="/images/sports-engineering-logo.png" alt="Company Logo" style={{ height: "40px" }}></img></Navbar.Brand> */}
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/shop/room" className="me-3">Categories</Nav.Link>
                            <NavDropdown title="Shop by Sport" id="basic-nav-dropdown">
                                <NavDropdown.Item href="/shop/room" className="dropdown-submenu">
                                    <span className="dropdown-item-text">All</span>
                                </NavDropdown.Item>
                                <NavDropdown.Item className="dropdown-submenu">
                                    <span className="dropdown-item-text">Sports</span>
                                    <ul className="dropdown-menu">
                                        { !sportsLoading && sports &&
                                            sports.map(sport => (
                                                <li key={sport.id}>
                                                    <NavDropdown.Item onClick={() => { window.location.href = `/shop/${sport.id}`; }}>
                                                        {sport.sport_name}
                                                    </NavDropdown.Item>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </NavDropdown.Item>
                                <NavDropdown.Item className="dropdown-submenu">
                                    <span className="dropdown-item-text">Categories</span>
                                    <ul className="dropdown-menu">
                                        { !categoriesLoading && categories &&
                                            categories.map(category => (
                                                <li key={category.id}>
                                                    <NavDropdown.Item onClick={() => { window.location.href = `/shop/${category.id}`; }}>
                                                        {category.category_name}
                                                    </NavDropdown.Item>
                                                </li>
                                            ))
                                        }

                                    </ul>
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Nav className="ms-auto">
                            {loggedIn ?
                                <Nav.Link onClick={handleLogout}>Log Out</Nav.Link>
                                :
                                <Nav.Link href="/login">Log In</Nav.Link>
                            }
                            <Nav.Link href="/portfolio">Portfolio</Nav.Link>
                            <Nav.Link href="/contact-us">Contact Us</Nav.Link>
                            <Nav.Link href="/about-us">About Us</Nav.Link>
                            <Nav.Link href="/cart">Cart</Nav.Link>
                            <Nav.Link href="/orders">Orders</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </Fragment>
    )
} 