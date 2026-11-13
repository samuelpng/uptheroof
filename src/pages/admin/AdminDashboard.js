import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const sections = [
  {
    title: "Products",
    description: "View, search, edit, and delete products.",
    path: "/admin/list",
    button: "Manage Products",
    variant: "dark",
  },
  {
    title: "Add Product",
    description: "Create a new product with images and categories.",
    path: "/admin/create",
    button: "Create Product",
    variant: "dark",
  },
  {
    title: "Homepage Carousel",
    description: "Edit homepage carousel images, titles, and buttons.",
    path: "/admin/carousel",
    button: "Manage Carousel",
    variant: "secondary",
  },
  {
    title: "Orders",
    description: "View and manage customer orders.",
    path: "/admin/orders",
    button: "Manage Orders",
    variant: "info",
  },
  {
    title: "Sports",
    description: "Add sports used for product filtering.",
    path: "/admin/create-sport",
    button: "Add Sport",
    variant: "outline-dark",
  },
  {
    title: "Categories",
    description: "Add categories used for product filtering.",
    path: "/admin/create-categories",
    button: "Add Category",
    variant: "outline-dark",
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <Container className="py-4">
      <div className="mb-4">
        <h1 style={{ fontFamily: "Righteous" }}>Admin Dashboard</h1>
        <p className="text-muted mb-0">Choose what you want to edit.</p>
      </div>

      <Row className="g-3">
        {sections.map((section) => (
          <Col key={section.path} xs={12} md={6} lg={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <Card.Title>{section.title}</Card.Title>
                <Card.Text className="text-muted flex-grow-1">
                  {section.description}
                </Card.Text>
                <Button
                  variant={section.variant}
                  onClick={() => navigate(section.path)}
                >
                  {section.button}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
