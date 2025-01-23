
import { useContext, useEffect, useState, Fragment } from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import CustomerContext from '../contexts/CustomerContext';

export default function NavBar() {

    const [loggedIn, setLoggedIn] = useState(false)


    const context = useContext(CustomerContext)
    const logout = async () => {
        await context.logout()
    }

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            setLoggedIn(true)
        } else {
            setLoggedIn(false)
        }
    }, [])

    return (
        <Fragment>
            <Navbar bg="light" expand="lg" sticky="top" className="lg-navbar">
                <Container>
                    <Navbar.Brand href="/" className="ms-2"><img src="/images/sports-engineering-logo.png" alt="Company Logo" style={{ height: "40px" }}></img></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/shop/room" className="me-3">Shop All</Nav.Link>
                            <NavDropdown title="Shop by Sport" id="basic-nav-dropdown">
                                <NavDropdown.Item href="/shop/room" className="dropdown-submenu">
                                    <span className="dropdown-item-text">All</span>
                                </NavDropdown.Item>
                                <NavDropdown.Item className="dropdown-submenu">
                                    <span className="dropdown-item-text">Sports</span>
                                    <ul className="dropdown-menu">
                                    <li><NavDropdown.Item onClick={() => {window.location.href = "/shop/athletics";}}>Atheltics</NavDropdown.Item></li>
                                    <li><NavDropdown.Item onClick={() => {window.location.href = "/shop/badminton";}}>Badminton</NavDropdown.Item></li>
                                    <li><NavDropdown.Item onClick={() => {window.location.href = "/shop/basketball"}}>Basektball</NavDropdown.Item></li>
                                    <li><NavDropdown.Item onClick={() => {window.location.href = "/shop/softball"}}>Softball</NavDropdown.Item></li>
                                    <li><NavDropdown.Item onClick={() => {window.location.href = "/shop/netball"}}>Netball</NavDropdown.Item></li>
                                    <li><NavDropdown.Item onClick={() => {window.location.href = "/shop/cricket"}}>Cricket</NavDropdown.Item></li>
                                    <li><NavDropdown.Item onClick={() => {window.location.href = "/shop/frisbee"}}>Frisbee</NavDropdown.Item></li>
                                    <li><NavDropdown.Item onClick={() => {window.location.href = "/shop/golf"}}>Golf</NavDropdown.Item></li>
                                    <li><NavDropdown.Item onClick={() => {window.location.href = "/shop/gymnastics"}}>Gymnastics</NavDropdown.Item></li>
                                    <li><NavDropdown.Item onClick={() => {window.location.href = "/shop/handball"}}>Handball</NavDropdown.Item></li>
                                    <li><NavDropdown.Item onClick={() => {window.location.href = "/shop/hockey-floorball"}}>Hockey & Floorball</NavDropdown.Item></li>
                                    <li><NavDropdown.Item onClick={() => {window.location.href = "/shop/rugby"}}>Rugby</NavDropdown.Item></li>
                                    <li><NavDropdown.Item onClick={() => {window.location.href = "/shop/soccer"}}>Soccer</NavDropdown.Item></li>
                                    <li><NavDropdown.Item onClick={() => {window.location.href = "/shop/swimming"}}>Swimming / Water Sports</NavDropdown.Item></li>
                                    <li><NavDropdown.Item onClick={() => {window.location.href = "/shop/table-tennis"}}>Table Tennis</NavDropdown.Item></li>
                                    <li><NavDropdown.Item onClick={() => {window.location.href = "/shop/volleyball"}}>Volleyball</NavDropdown.Item></li>
                                    </ul>
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Nav className="ms-auto">
                            {loggedIn ?
                                <Nav.Link onClick={logout}>Log Out</Nav.Link>
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