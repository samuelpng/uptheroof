import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ProductCard(props) {
  return (
    <div className="row g-3">
      {props.products.map((p) => {
        const hasHoverImage = Boolean(p.image_url2);

        return (
          <div className="col-12 col-md-6 col-lg-3" key={p.id}>
            <Card
              className={`product-card h-100${hasHoverImage ? " has-hover-image" : ""}`}
              as={Link}
              to={`/products/${p.id}`}
            >
              <div className="card-img-wrap">
                <Card.Img
                  variant="top"
                  src={p.image_url}
                  alt={p.name}
                />
                {hasHoverImage && (
                  <Card.Img
                    variant="top"
                    className="back-img"
                    src={p.image_url2}
                    alt={`${p.name} alternate`}
                  />
                )}
              </div>
              <Card.Body>
                <Card.Title>{p.name}</Card.Title>
                <Card.Text>
                  {p.sports?.sport_name || "Sport"}
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
