import { Fragment, useState, useEffect } from 'react';
import { Carousel, Container, Button, Accordion, Placeholder, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '../supabaseClient';

export default function ProductPage() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);

    const getProductById = async (productId) => {
        const { data, error } = await supabase
            .from("products")
            .select(`
                id,
                name,
                description,
                sport_id,
                image_url,
                image_url2,
                sports(sport_name),
                products_categories(categories(id, category_name))
            `)
            .eq("id", productId)
            .single();

        if (error) {
            console.error("Error fetching product:", error);
        } else {
            setProduct(data);
        }
    };

    useEffect(() => {
        if (productId) {
            getProductById(productId);
        }
    }, [productId]);

    const addToCart = async () => {
        // check if user is logged in
        // if (localStorage.getItem("accessToken")) {

        //     const customerData = JSON.parse(localStorage.getItem("customer"))
        //     let customerId = customerData.id
        //     let variantId = selectedVariant

        //     try {
        //         console.log(BASE_URL + `cart/${variantId}/add`)
        //         let response = await axios.post(BASE_URL + `cart/${variantId}/add`,
        //             {
        //                 customer_id: customerId,
        //                 variant_id: variantId
        //             },
        //             {
        //                 headers: {
        //                     authorization: `Bearer ${localStorage.getItem("accessToken")}`
        //                 },
        //             })
        //         toast.success('Successfully added to cart')
        //         return true
        //     } catch (error) {
        //         toast.error("Maximum items in cart exceeded")
        //         return false
        //     }
        // } else {
        //     toast.error('You have to log in to add to cart')
        // }
    }

    if (!product) {
        return (
            <Container>
                <div className="row">
                    <div className="col-md-7 mt-5 imagePlaceholder"></div>
                    <div className="col-12 col-md-5 mt-5">
                        <Placeholder as={Card.Title} animation="glow">
                            <Placeholder xs={6} />
                        </Placeholder>
                        <Placeholder as={Card.Text} animation="glow">
                            <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                            <Placeholder xs={6} className="mt-3" /> <Placeholder xs={8} />
                        </Placeholder>
                    </div>
                </div>
                <ToastContainer />
            </Container>
        );
    }

    return (
        <Fragment>
            <Container>
                <div className="row">
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
            </Container>
        </Fragment>
    );
}
