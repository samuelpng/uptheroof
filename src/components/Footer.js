import React from "react";
import { Container, Row, Col, Nav, Badge } from "react-bootstrap";
import { FaFacebook, FaLinkedin, FaWhatsapp, FaArrowUp, FaInstagram } from "react-icons/fa";
import "../Footer.css";

const Footer = () => {
  return (
    <footer className="footer text-white py-4">
      <Container>
        <Row>
          {/* Left Section - Links */}
          <Col md={6}>
            <Row>
              <Col xs={6}>
                <Nav className="flex-column">
                  <Nav.Link href="/about-us" className="text-white">
                    About Us
                  </Nav.Link>
                  <Nav.Link href="/contact-us" className="text-white">
                    Services
                  </Nav.Link>
                  <Nav.Link href="/portfolio" className="text-white">
                    Portfolio
                  </Nav.Link>
                  <Nav.Link href="/contact-us" className="text-white">
                    Contact Us
                  </Nav.Link>
                </Nav>
              </Col>
              <Col xs={6}>
                <Nav className="flex-column">
                  <Nav.Link href="/shop/room" className="text-white">
                    Terms and Conditions
                  </Nav.Link>
                </Nav>
              </Col>
            </Row>
          </Col>

          {/* Right Section - Contact Details */}
          <Col md={6} className="text-md-end mt-3 mt-md-0">
            <p className="mb-1">
              12 Tampines North Drive 4, #06-25,<br />
              Stellar @ Tampines<br />
              Singapore 529435
            </p>
            <p className="mb-1">
              <a href="mailto:batam@ejsports.com.sg" className="text-white">
                batam@ejsports.com.sg
              </a>
            </p>
            <p className="mb-3">(+65) 8444 2590</p>

            {/* Social Media Icons */}
            <div className="d-flex justify-content-md-end gap-3">
              <a href="#" className="text-white fs-4">
                <FaFacebook />
              </a>
              <a href="https://www.instagram.com/ejsportsengine/profilecard/?igsh=YXpjeHR6dGRqcWk4" className="text-white fs-4">
                <FaInstagram />
              </a>
              <a href="#" className="text-white fs-4">
                <FaWhatsapp />
              </a>
            </div>
          </Col>
        </Row>

        {/* Horizontal Line */}
        <hr className="my-3 border-light" />

        {/* Copyright */}
        <p className="text-center mb-0">EJ Sports Engineering Pte Ltd</p>


        {/* Scroll to Top Button */}
        {/* <a href="#" className="scroll-top">
          <FaArrowUp />
        </a> */}
      </Container>
    </footer>
  );
};

export default Footer;
