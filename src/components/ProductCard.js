import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ProductCard(props) {
  return (
    <div className="row g-3">
      {props.products.map((p) => {
        return (
          <div className="col-12 col-md-6 col-lg-3" key={p.id}>
            <Card
              className="product-card h-100"
              as={Link}
              to={`/products/${p.id}`}
            >
              <Card.Img
                variant="top"
                src={p.image_url}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  backgroundColor: "#fff",
                  aspectRatio: "1 / 1",
                }}
              />
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
