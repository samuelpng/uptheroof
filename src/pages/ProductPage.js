import { Fragment, useState, useEffect } from "react";
import {
  Carousel,
  Container,
  Button,
  Accordion,
  Placeholder,
  Card,
  Row,
  Image,
  Col,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../supabaseClient";

export default function ProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
//   const [similarProducts, setSimilarProducts] = useState([]);
  const { user } = useAuth();

  const [mainImage, setMainImage] = useState("");
  const [thumbnails, setThumbnails] = useState([])

  const getProductById = async (productId) => {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
                id,
                name,
                description,
                sport_id,
                image_url,
                image_url2,
                image_url3,
                sports(sport_name),
                products_categories(categories(id, category_name))
            `
      )
      .eq("id", productId)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
    } else {
      setProduct(data);

      setMainImage(data.image_url)
      let images = [data.image_url];
      if (data.image_url2) images.push(data.image_url2)
      if (data.image_url3) images.push(data.image_url3)
      setThumbnails(images)
    }
  };

  useEffect(() => {
    if (productId) {
      getProductById(productId);
    }
  }, [productId]);

  const addToCart = async () => {
    // Check if user is logged in
    if (user) {
      const { data, error } = await supabase.from("profiles_products").insert({
        profile_id: user.id,
        product_id: productId,
      });

      if (!error) {
        Swal.fire({
          title: "Added to Cart",
          text: `${product.product_name} was successfully added to the cart!`,
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Oops!",
          text: error || "There was a problem adding your product to the cart.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } else {
      toast.error("You have to log in to add to cart");
    }
  };
  

  if (!product) {
    return (
      <Container>
        <div className="row bg-light">
          <div className="col-md-7 mt-5 imagePlaceholder"></div>
          <div className="col-12 col-md-5 mt-5">
            <Placeholder as={Card.Title} animation="glow">
              <Placeholder xs={6} />
            </Placeholder>
            <Placeholder as={Card.Text} animation="glow">
              <Placeholder xs={7} /> <Placeholder xs={4} />{" "}
              <Placeholder xs={4} /> <Placeholder xs={6} className="mt-3" />{" "}
              <Placeholder xs={8} />
            </Placeholder>
          </div>
        </div>
        <ToastContainer />
      </Container>
    );
  }

  return (
    <Fragment>
    <section className="bg-light">
      <Container className="py-4">
      <Row className="g-4">
        {/* Left Section (Images) */}
        <Col md={6}>
          <div className="p-3 border rounded bg-light">
            <Row className="flex-md-row flex-column">
              {/* Main Image */}
              <Col xs={12} md={9} className="order-md-1">
                <Image src={mainImage} fluid className="border rounded w-100" />
              </Col>

              {/* Thumbnails - Left on Desktop, Bottom on Mobile */}
              <Col xs={12} md={3} className="d-flex flex-md-column flex-row justify-content-center gap-2 mt-2 mt-md-0">
                {thumbnails.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    thumbnail
                    className="border"
                    onClick={() => setMainImage(img)}
                    style={{ cursor: "pointer", width: "60px", height: "60px" }}
                  />
                ))}
              </Col>
            </Row>
          </div>
        </Col>

        {/* Right Section (Details) */}
        <Col md={6}>
          <div className="p-4 border rounded bg-white shadow-sm">
            <h3 className="fw-bold">{product.name}</h3>
            <p className="text-muted">SKU: IF HAVE</p>
            <p><b>Categories:</b> {product.products_categories?.length > 0
                                ? product.products_categories.map(pc => pc.categories.category_name).join(', ')
                                : 'No Categories'}
            </p>
            <p><b>Sport:</b> {product.sports?.sport_name}</p>
            <p><b>Description:</b> <br /> {product.description}</p>
            {/* <p className="small">
              Tax included. <a href="#">Shipping calculated at checkout</a>
            </p> */}

            {/* Quantity Selector */}
            {/* <InputGroup className="my-3 w-50">
              <Button variant="outline-secondary">-</Button>
              <FormControl type="number" className="text-center" defaultValue="1" />
              <Button variant="outline-secondary">+</Button>
            </InputGroup> */}

            {/* Action Buttons */}
            <div className="d-flex gap-2">
              <Button variant="dark" className="w-50" onClick={addToCart}>
                Add to Cart
              </Button>
              {/* <Button variant="primary" className="w-100">
                Buy with Shop Pay
              </Button> */}
            </div>

            {/* <div className="mt-3">
              <a href="#" className="text-decoration-none">
                More payment options
              </a>
            </div> */}
          </div>
        </Col>
      </Row>
    </Container>
    </section>
  
      {/* <Container>
                <div className="row container">
                    <div className="col-md-7 mb-2">
                        <Carousel variant="dark">
                            <Carousel.Item>
                                <img className="d-block w-100" src={product.image_url} alt="First slide" />
                            </Carousel.Item>
                            {product.image_url2 && (
                                <Carousel.Item>
                                    <img className="d-block w-100" src={product.image_url2} alt="Second slide" />
                                </Carousel.Item>
                            )}
                        </Carousel>
                    </div>
                    <div className="col-md-5 mb-2">
                        <h2 className="mt-3">{product.name}</h2>
                        <p><strong>Sport:</strong> {product.sports?.sport_name || 'Unknown'}</p>
                        
                        <p><strong>Categories:</strong> 
                            {product.products_categories?.length > 0
                                ? product.products_categories.map(pc => pc.categories.category_name).join(', ')
                                : 'No Categories'}
                        </p>

                        <div className="mt-4">{product.description}</div>

                        <Accordion className="mt-3">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Product Details</Accordion.Header>
                                <Accordion.Body>
                                    <div className="details-container">
                                        <div>{product.description || 'N/A'}</div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                        <div className="d-grid mt-4 me-2">
                                <Button variant="dark" className="rounded-0 py-2" type="button" onClick={addToCart}>ADD TO CART</Button>
                            </div>
                    </div>
                </div>
            </Container> */}
    </Fragment>
  );
}
