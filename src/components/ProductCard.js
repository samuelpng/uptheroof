import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ProductCard(props) {
  return (
    <div className="row">
      {props.products.map((p) => {
        return (
          <div className="col-12 col-md-6 col-lg-3 mb-2" key={p.id}>
            <Card
              style={{
                cursor: "pointer",
                textDecoration: "none",
                color: "black",
              }}
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
                  backgroundColor: "white",
                  aspectRatio: "1 / 1", // Ensures the image maintains a 1:1 aspect ratio
                }}
              />
              <Card.Img
                variant="top"
                className="back-img"
                src={p.image_url}
                style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                    backgroundColor: "white",
                    aspectRatio: "1 / 1", // Ensures the image maintains a 1:1 aspect ratio
                  }}
              />
              <Card.Body>
                <Card.Title>{p.name}</Card.Title>
                <Card.Text>
                  {p.sports.sport_name} <br />
                  {/* S$ {(p.cost / 100).toFixed(2)} */}
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
