import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";

const projects = [
  {
    title: "Goalposts",
    description: `Set up goalposts for: MOE, Sports Council, Academy etc`,
    images: [
      "/images/MOE1.png",
      "/images/MOE2.png",
      "/images/MOE3.png",
      "/images/MOE4.jpg",
    ],
  },
  {
    title: "Basketball Hoops",
    description: "Set up basketball hoops for: MOE, Sports Council, Community Club, Academy etc",
    images: ["/images/hoops1.png", "/images/hoops2.png"],
  },
  {
    title: "Acrylic Coating",
    description: "Set up acrylic coating: Acrylic Coating Recreation Centre, MOE etc",
    images: ["/images/acryliccoating1.png", "/images/acryliccoating2.jpg"],
  },
];

const ProjectsPage = () => {
  return (
    <section id="projects" className="bg-light">
      <header className="bg-primary text-white text-center py-5">
        <div className="container">
          <h1>Our Projects</h1>
          <p className="lead">Innovative solutions for a better future</p>
        </div>
      </header>
      <div className="container pt-3 bg-light">
        {projects.map((project, index) => (
          <div key={index} className="row align-items-center mb-5">
            {/* Alternates Left/Right */}
            <div
              className={`col-md-6 ${
                index % 2 === 0 ? "order-md-1" : "order-md-2"
              }`}
            >
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>

            {/* Image Carousel - Alternates Right/Left */}
            <div
              className={`col-md-6 ${
                index % 2 === 0 ? "order-md-2" : "order-md-1"
              }`}
            >
              <Carousel>
                {project.images.map((img, imgIndex) => (
                  <Carousel.Item key={imgIndex}>
                    <img
                      src={img}
                      className="d-block w-100"
                      style={{ maxHeight: "400px", objectFit: "cover" }}
                      alt={`Slide ${imgIndex}`}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsPage;
