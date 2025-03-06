
import { useContext, useEffect, useState, Fragment } from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
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

    // Fetch categories & sports for dropdowns
//   const fetchCategories = async () => {
//     const { data: categories } = await supabase.from("categories").select("*");

//     const { data: sports } = await supabase.from("sports").select("*");
//     const formattedCategories = categories.map((category) => ({
//       id: category.id,
//       name: category.category_name
//     }))
//     console.log(sports)
//     setCategories(formattedCategories || []);
//     // setSports(sports || []);
//   };
    // if (sportsLoading || categoriesLoading){
    //     return;
    // }

    
    return (
        <Fragment>
            <Navbar bg="light" expand="lg" sticky="top" className="lg-navbar">
                <Container>
                    <Navbar.Brand href="/" className="ms-2"><img src="/images/sports-engineering-logo.png" alt="Company Logo" style={{ height: "40px" }}></img></Navbar.Brand>
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