import { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import { supabase } from "../supabaseClient";
import "../App.css";

export default function LandingCarousel() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      const { data, error } = await supabase
        .from("carousel_slides")
        .select("id, title, image_url, button_text, button_link, sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching carousel slides:", error.message);
        setSlides([]);
      } else {
        setSlides(data || []);
      }
      setLoading(false);
    };

    fetchSlides();
  }, []);

  if (loading) {
    return <div className="carousel-container bg-light" style={{ minHeight: "200px" }} />;
  }

  if (slides.length === 0) {
    return null;
  }

  return (
    <Carousel fade>
      {slides.map((slide) => (
        <Carousel.Item key={slide.id}>
          <div className="carousel-container">
            <img
              className="d-block w-100"
              src={slide.image_url}
              alt={slide.title || "Carousel slide"}
            />
          </div>
          <Carousel.Caption className="landing-carousel">
            {slide.title && <h3>{slide.title}</h3>}
            {slide.button_text && slide.button_link && (
              <a className="button-dark" href={slide.button_link}>
                {slide.button_text}
              </a>
            )}
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
