import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";

const projects = [
  {
    title: "Goalposts",
    description: `Our team had the privilege of setting up professional-grade goalposts for prominent clients including Lion City Sailors Football Club, various Ministry of Education (MOE) schools, and Sports Council.

Each installation was tailored to the client’s needs, ensuring safety, durability, and compliance with official regulations. From full-sized match goalposts at training grounds to school and community field setups, we handled every aspect — from delivery and assembly to on-site alignment and safety checks.

These projects reflect our commitment to quality, precision, and supporting Singapore’s sporting excellence at every level — from youth development to the professional arena.`,
    images: [
      "/images/MOE1.png",
      "/images/MOE2.png",
      "/images/MOE3.png",
      "/images/MOE4.jpg",
    ],
  },
  {
    title: "Basketball Hoops",
    description: `Basketball Hoop Installations – MOE, Sports Council, Community Clubs & Academies

We’ve successfully delivered and installed high-quality basketball systems for a wide range of clients, including MOE schools, Sport Singapore facilities, Community Clubs, and private Basketball Academies.

Each setup was carefully tailored to meet specific site requirements — whether for indoor sports halls, outdoor courts, or multipurpose venues. Our scope of work included supplying adjustable and fixed-height hoops, secure anchoring, backboard installation, and post-installation safety inspections.

These projects reflect our ability to handle both large-scale institutional installations and customised solutions that promote active lifestyles and sporting excellence across Singapore.`,
    images: ["/images/hoops1.png", "/images/hoops2.png"],
  },
  {
    title: "Acrylic Coating",
    description: `Acrylic Sports Surface Coating – Recreation Centres, MOE Schools & More

We provide high-quality acrylic sports surface coating services for Recreation Centres, MOE schools, and various community and private facilities across Singapore.

Our work includes full surface preparation, application of multi-layer acrylic coatings, and line marking for sports such as tennis, basketball, volleyball, and futsal. These surfaces are designed for optimal grip, durability, and weather resistance, enhancing playability while ensuring safety.

Each project is delivered with attention to detail and quality assurance, helping to transform regular courts into professional, vibrant playing surfaces that last.`,
    images: ["/images/acryliccoating1.png", "/images/acryliccoating2.jpg"],
  },
];

const ProjectsPage = () => {
  return (
    <section id="projects" className="bg-light">
      <header className="text-white text-center py-5" style={{backgroundColor: "#004aad"}}>
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
