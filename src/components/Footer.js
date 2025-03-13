import React from "react";
import { Container, Row, Col, Nav, Badge } from "react-bootstrap";
import { FaFacebook, FaLinkedin, FaWhatsapp, FaArrowUp } from "react-icons/fa";
import "../Footer.css";

const Footer = () => {
  return (
    <footer className="footer bg-primary text-white py-4">
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
                  <Nav.Link href="/services" className="text-white">
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
            <p className="mb-1">485 Yio Chu Kang Road #03-13, Catle Green, Singapore 787058</p>
            <p className="mb-1">
              <a href="mailto:ejsportsengineering@gmail.com" className="text-white">
                ejsportsengineering@gmail.com
              </a>
            </p>
            <p className="mb-3">(+65) 9022 2227</p>

            {/* Social Media Icons */}
            <div className="d-flex justify-content-md-end gap-3">
              <a href="#" className="text-white fs-4">
                <FaFacebook />
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
