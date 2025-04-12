import { useContext, useEffect, useState, Fragment } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import CategoriesContext from "../contexts/CategoriesContext";
import SportsContext from "../contexts/SportsContext";

export default function NavBar() {
  const { sports, sportsLoading } = useContext(SportsContext);
  const { categories, categoriesLoading } = useContext(CategoriesContext);

  const [loggedIn, setLoggedIn] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    setLoggedIn(!!user);
  }, [user]);

  // Sort categories and sports alphabetically
  const sortedCategories = categories
    ? [...categories].sort((a, b) =>
        a.category_name.localeCompare(b.category_name)
      )
    : [];
  const sortedSports = sports
    ? [...sports].sort((a, b) => a.sport_name.localeCompare(b.sport_name))
    : [];

  return (
    <Fragment>
      <div className="top-bar">
        <div className="top-bar-container">
          <a href="/" className="logo">
            <img src="/images/sports-engineering-logo.png" alt="Company Logo" />
          </a>
          <form className="search-bar">
            <input type="text" placeholder="Search our catalog" />
          </form>
          <NavDropdown
            title={
              <span style={{ fontSize: "1.5rem", cursor: "pointer" }}>👤</span>
            }
            id="account-dropdown"
            align="end"
            className="icon-dropdown"
          >
            {loggedIn ? (
              <NavDropdown.Item onClick={handleLogout}>
                Log Out
              </NavDropdown.Item>
            ) : (
              <NavDropdown.Item href="/login">Log In</NavDropdown.Item>
            )}
          </NavDropdown>
          <a href="/cart" className="icon fs-4" title="View Cart">
            🛒
          </a>
        </div>
      </div>

      <Navbar expand="lg" sticky="top" className="lg-navbar orange-navbar">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="Categories" id="categories-dropdown">
                {!categoriesLoading &&
                  sortedCategories.map((category) => (
                    <NavDropdown.Item
                      key={category.id}
                      href={`/shop/category/${category.id}`}
                    >
                      {category.category_name}
                    </NavDropdown.Item>
                  ))}
              </NavDropdown>
              <NavDropdown title="Shop by Sport" id="sports-dropdown">
                {!sportsLoading &&
                  sortedSports.map((sport) => (
                    <NavDropdown.Item
                      key={sport.id}
                      href={`/shop/sports/${sport.id}`}
                    >
                      {sport.sport_name}
                    </NavDropdown.Item>
                  ))}
              </NavDropdown>
            </Nav>
            <Nav className="ms-auto">
              {/* {loggedIn ? (
                <Nav.Link onClick={handleLogout}>Log Out</Nav.Link>
              ) : (
                <Nav.Link href="/login">Log In</Nav.Link>
              )} */}
              <Nav.Link href="/portfolio">Portfolio</Nav.Link>
              <Nav.Link href="/contact-us">Contact Us</Nav.Link>
              <Nav.Link href="/about-us">About Us</Nav.Link>
              <Nav.Link href="/orders">Orders</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Fragment>
  );
}
