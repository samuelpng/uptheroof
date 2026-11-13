import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const sections = [
  {
    title: "Products",
    description: "View, search, edit, and delete products.",
    path: "/admin/list",
    button: "Manage Products",
    accent: "var(--brand-orange)",
  },
  {
    title: "Add Product",
    description: "Create a new product with images and categories.",
    path: "/admin/create",
    button: "Create Product",
    accent: "var(--brand-orange)",
  },
  {
    title: "Homepage Carousel",
    description: "Edit homepage carousel images, titles, and buttons.",
    path: "/admin/carousel",
    button: "Manage Carousel",
    accent: "var(--brand-blue)",
  },
  {
    title: "Orders",
    description: "View and manage customer orders.",
    path: "/admin/orders",
    button: "Manage Orders",
    accent: "var(--brand-blue)",
  },
  {
    title: "Sports",
    description: "View, add, edit, and delete sports.",
    path: "/admin/sports",
    button: "Manage Sports",
    accent: "var(--ink)",
  },
  {
    title: "Categories",
    description: "View, add, edit, and delete categories.",
    path: "/admin/categories",
    button: "Manage Categories",
    accent: "var(--ink)",
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="admin-shell">
      <Container>
        <div className="admin-header">
          <div>
            <h1 className="mb-1" style={{ fontFamily: "Righteous" }}>
              Admin Dashboard
            </h1>
            <p className="text-muted mb-0">Choose what you want to edit.</p>
          </div>
        </div>

        <Row className="g-3">
          {sections.map((section) => (
            <Col key={section.path} xs={12} md={6} lg={4}>
              <Card
                className="admin-card"
                onClick={() => navigate(section.path)}
              >
                <Card.Body className="d-flex flex-column">
                  <div
                    style={{
                      width: 36,
                      height: 4,
                      borderRadius: 999,
                      background: section.accent,
                      marginBottom: 14,
                    }}
                  />
                  <Card.Title>{section.title}</Card.Title>
                  <Card.Text className="text-muted flex-grow-1">
                    {section.description}
                  </Card.Text>
                  <Button
                    className="btn-brand align-self-start"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(section.path);
                    }}
                  >
                    {section.button}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
