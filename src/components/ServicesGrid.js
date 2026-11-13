import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const services = [
  {
    image: "/images/basketball.jpg",
    title: "Sports Catalogues at Wholesale prices",
    description: "Take a look at our range of items.",
    link: "/shop",
    button: "Explore",
  },
  {
    image: "/images/courttape.png",
    title: "Outdoor and Indoor Sports Flooring",
    description:
      "Get in touch with us today for the best indoor and outdoor sports flooring in Singapore today!",
    link: "/contact-us",
    button: "Enquire",
  },
  {
    image: "/images/napfaequipment.png",
    title: "Napfa Equipment",
    description:
      "View our NAPFA equipment and get in touch with us for Napfa equipment for your school",
    link: "/shop/category/18",
    button: "Enquire",
  },
  {
    image: "/images/portfolioimage.png",
    title: "Our Portfolio",
    description:
      "Explore our portfolio to discover how we've delivered impactful solutions for schools and other organisations",
    link: "/portfolio",
    button: "Explore",
  },
  {
    image: "/images/flooring.png",
    title: "Flooring Services",
    description:
      "We provide safe, durable flooring for sports areas and kids' playgrounds—built for comfort, impact absorption, and lasting performance. Enquire now to find the right solution for your space.",
    link: "/contact-us",
    button: "Enquire",
  },
  {
    image: "/images/call.png",
    title: "Contact EJ Sports Singapore",
    description:
      "Please feel free to contact us if you have any questions or queries on the products or services we provide",
    link: "/contact-us",
    button: "Contact Us",
  },
];

const ServicesGrid = () => {
  return (
    <section className="site-section">
      <Container>
        <div className="text-center mb-4">
          <h2 className="section-title">What We Offer</h2>
          <p className="section-subtitle mb-0">
            Equipment, flooring, and project delivery for schools and organisations.
          </p>
        </div>
        <Row className="g-4">
          {services.map((service, index) => (
            <Col key={index} md={6} lg={4}>
              <div className="service-tile h-100 d-flex flex-column">
                <div className="service-tile-image">
                  <img src={service.image} alt={service.title} />
                </div>
                <h5 className="mb-2" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700 }}>
                  {service.title}
                </h5>
                <p className="text-muted flex-grow-1">{service.description}</p>
                <div>
                  <Button className="btn-brand-blue" href={service.link}>
                    {service.button}
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default ServicesGrid;
