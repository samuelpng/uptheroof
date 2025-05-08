import "../App.css";
import { Carousel } from "react-bootstrap";
// import { Link } from 'react-router-dom';
import "../App.css";

export default function LandingCarousel() {
  return (
    <Carousel fade>
      <Carousel.Item>
        <div className="carousel-container">
          <img
            className="d-block w-100"
            src="/images/flooring-banner.png"
            alt="xSpeed"
          />
        </div>
        <Carousel.Caption className="landing-carousel">
          <h3>FLOORING SERVICES</h3>
          {/* <h5>UNLOCK SPEED IN ALL DIMENSIONS WITH THE NEW X SPEEDPORTAL.</h5> */}
          {/* <a className="button-dark" href="/products/3">
            Shop Now
          </a> */}
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <div className="carousel-container">
          <img
            className="d-block w-100"
            src="/images/goalpost.png"
            alt="xSpeed"
          />
        </div>
        <Carousel.Caption className="landing-carousel">
          <h3>GOALPOSTS</h3>
          {/* <h5>UNLOCK SPEED IN ALL DIMENSIONS WITH THE NEW X SPEEDPORTAL.</h5> */}
          <a className="button-dark" href="/products/3">
            Shop Now
          </a>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <div className="carousel-container">
          <img
            className="d-block w-100"
            src="/images/badmintoncourt.png"
            alt="Second slide"
          />
        </div>

        <Carousel.Caption className="landing-carousel">
          <h3>COURT TAPING</h3>
          {/* <h5>THE NIKE AIR ZOOM MERCURIAL LUCENT PACK. AVAILABLE NOW.</h5> */}
          <a className="button-dark" href="/products/2">
            Shop Now
          </a>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <div className="carousel-container">
          <img
            className="d-block w-100"
            src="/images/napfaequipment.png"
            alt="Puma Future"
          />
        </div>

        <Carousel.Caption className="landing-carousel">
          <h3>NAPFA Equipment</h3>
          {/* <h5>LOCK IN. DRIVE THEM CRAZY.</h5> */}
          <a className="button-dark" href="/products/13">
            Shop Now
          </a>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}
