import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const services = [
  {
    image: "/images/basketball.jpg", 
    title: "Sports Catalogues at Wholesale prices",
    description:
      "Take a look at our range of items.",
    link: "/shop/room",
  },
  {
    image: "/images/courttape.png",
    title: "Outdoor and Indoor Sports Flooring",
    description:
      "Get in touch with us today for the best indoor and outdoor sports flooring in Singapore today!",
    link: "#",
  },
  {
    image: "/images/napfaequipment.png",
    title: "Napfa Equipment",
    description:
      "Get in touch with us for Napfa equipment for your school",
    link: "#",
  },
  {
    image: "/images/call.png",
    title: "Contact EJ Sports Singapore",
    description:
      "Please feel free to contact us if you have any questions or queries to the products or services we provide",
    link: "#",
  },
];

const ServicesGrid = () => {
  return (
    <Container className="py-5">
      <Row className="text-center">
        {services.map((service, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card className="border-0">
              <div
                className="mx-auto"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  overflow: "hidden",
                }}
              >
                <Card.Img
                  src={service.image}
                  alt={service.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <Card.Body>
                <Card.Title>{service.title}</Card.Title>
                <Card.Text>{service.description}</Card.Text>
                <Button variant="secondary" href={service.link}>
                  Explore »
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ServicesGrid;
