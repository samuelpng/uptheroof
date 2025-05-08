import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const services = [
  {
    image: "/images/basketball.jpg", 
    title: "Sports Catalogues at Wholesale prices",
    description:
      "Take a look at our range of items.",
    link: "/shop",
    button: "Explore"
  },
  {
    image: "/images/courttape.png",
    title: "Outdoor and Indoor Sports Flooring",
    description:
      "Get in touch with us today for the best indoor and outdoor sports flooring in Singapore today!",
    link: "/contact-us",
    button: "Enquire"
  },
  {
    image: "/images/napfaequipment.png",
    title: "Napfa Equipment",
    description:
      "View our NAPFA equipment and get in touch with us for Napfa equipment for your school",
    link: "/shop/category/18",
    button: "Enquire"
  },
  {
    image: "/images/portfolioimage.png",
    title: "Our Portfolio",
    description:
      "Explore our portfolio to discover how we've delivered impactful solutions for schools and other organisations",
    link: "/portfolio",
    button: "Explore"
  },
  {
    image: "/images/flooring.png",
    title: "Flooring Services",
    description:
      "We provide safe, durable flooring for sports areas and kids' playgrounds—built for comfort, impact absorption, and lasting performance. Enquire now to find the right solution for your space.",
    link: "/contact-us",
    button: "Contact Us"
  },
  {
    image: "/images/call.png",
    title: "Contact EJ Sports Singapore",
    description:
      "Please feel free to contact us if you have any questions or queries to the products or services we provide",
    link: "/contact-us",
    button: "Contact Us"
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
                  {service.button}
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
