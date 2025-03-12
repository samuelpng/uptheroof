import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const projects = [
  {
    title: "Goalposts",
    description: "A cutting-edge logistics platform improving efficiency.",
    images: [
      "/images/MOE1.png",
      "/images/MOE2.png",
      "/images/MOE3.png",
      "/images/MOE4.jpg"
    ]
  },
  {
    title: "Basketball Hoops",
    description: "A real-time tracking system for seamless operations.",
    images: [
      "/images/hoops1.jpg",
      "/images/hoops2.jpg",
    ]
  },
  {
    title: "Acrylic Coating",
    description: "AI-powered analytics for smarter decision-making.",
    images: [
      "/images/acryliccoating1",
      "/images/acryliccoating2",
    ]
  }
];

const ProjectsPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <header className="bg-primary text-white text-center py-5">
        <div className="container">
          <h1>Our Projects</h1>
          <p className="lead">Innovative solutions for a better future</p>
        </div>
      </header>

      {/* Projects Section */}
      <section id="projects" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center">Featured Projects</h2>
          {projects.map((project, index) => (
            <div key={index} className="mb-5">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="row">
                {project.images.map((img, imgIndex) => (
                  <div key={imgIndex} className="col-md-3 mb-3">
                    <img src={img} className="img-fluid" alt={project.title} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5">
        <div className="container text-center">
          <h2>Contact Us</h2>
          <p>Email: contact@company.com</p>
          <p>Phone: +1 (123) 456-7890</p>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
