import React from "react";
import { Container, Row, Col, Nav, Badge } from "react-bootstrap";
import { FaFacebook, FaLinkedin, FaWhatsapp, FaArrowUp, FaInstagram } from "react-icons/fa";
import "../Footer.css";

const Footer = () => {
  return (
    <footer className="footer text-white">
      <Container>
        <Row className="gy-4">
          <Col md={6}>
            <h5 className="mb-3" style={{ fontFamily: "Righteous" }}>EJ Sports Engineering</h5>
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
                  <Nav.Link href="/shop" className="text-white">
                    Shop
                  </Nav.Link>
                  <Nav.Link href="/orders" className="text-white">
                    Orders
                  </Nav.Link>
                </Nav>
              </Col>
            </Row>
          </Col>

          <Col md={6} className="text-md-end">
            <p className="mb-1">
              12 Tampines North Drive 4, #06-25,<br />
              Stellar @ Tampines<br />
              Singapore 529435
            </p>
            <p className="mb-1">
              <a href="mailto:ejsportseng@gmail.com">
                ejsportseng@gmail.com
              </a>
            </p>
            <p className="mb-1">
              <a href="mailto:batam@ejsports.com.sg">
                batam@ejsports.com.sg
              </a>
            </p>
            <p className="mb-3">(+65) 8444 2590</p>

            <div className="d-flex justify-content-md-end gap-2 footer-social">
              <a href="#" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a
                href="https://www.instagram.com/ejsportsengine/profilecard/?igsh=YXpjeHR6dGRqcWk4"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a href="#" aria-label="WhatsApp">
                <FaWhatsapp />
              </a>
            </div>
          </Col>
        </Row>

        <hr className="my-4" />

        <p className="text-center mb-0" style={{ opacity: 0.85 }}>
          © {new Date().getFullYear()} EJ Sports Engineering Pte Ltd
        </p>


        {/* Scroll to Top Button */}
        {/* <a href="#" className="scroll-top">
          <FaArrowUp />
        </a> */}
      </Container>
    </footer>
  );
};

export default Footer;
