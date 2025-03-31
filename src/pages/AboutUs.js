import React from "react";
import { Container, Row, Col, Image, Card } from "react-bootstrap";

const AboutUs = () => {
  return (
    <Container className="py-5">
      <Row className="text-center mb-4">
        <Col>
          <h2>About Us</h2>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <h4>Mission</h4>
          <p>
            To offer every sport quality equipment, excellent service, and
            creative solutions that bring out the best of athletes.
          </p>
        </Col>
        <Col md={6}>
          <h4>Vision</h4>
          <p>Elevate Sports for Every Athlete, Everywhere.</p>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <h4>Company Description</h4>
          <p>
            Our company is experienced in solving complex sporting equipment
            issues and in representing our clients’ best interests. We have
            been providing our services to big events like SEA Games, Youth
            Olympic Games, Asian Indoor & Martial Arts Games, FIBA 3x3 Asian
            Singapore, etc.
          </p>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <h4>Company Images</h4>
          <Row>
            <Col md={4}>
              <Image src="/images/company1.jpg" fluid rounded />
            </Col>
            <Col md={4}>
              <Image src="/images/company2.jpg" fluid rounded />
            </Col>
            <Col md={4}>
              <Image src="/images/company3.jpg" fluid rounded />
            </Col>
          </Row>
        </Col>
      </Row>
      {/* Optional Team Section */}
      {/* <Row className="mb-4">
        <Col>
          <h4>Our Team</h4>
          <Card>
            <Card.Body>
              <Card.Title>Team Member Name</Card.Title>
              <Card.Text>Role in the company</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row> */}
      {/* Media Kit/Logos */}
      <Row className="mb-4">
        <Col>
          <h4>Media Kit & Logos</h4>
          <Row>
            <Col md={4}>
              <Image src="/logos/logo-white.png" fluid />
            </Col>
            <Col md={4}>
              <Image src="/logos/logo-black.png" fluid />
            </Col>
            <Col md={4}>
              <Image src="/logos/logo-colored.png" fluid />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;
