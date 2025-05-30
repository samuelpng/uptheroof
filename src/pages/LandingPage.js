import { Fragment, useContext, useEffect, useState } from "react";
import '../App.css';
import LandingCarousel from "../components/LandingCarousel";
import ProductsContext from "../contexts/ProductsContext";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Card } from "react-bootstrap";
import { createSearchParams, useNaigate, Link } from "react-router-dom";
import ServicesGrid from "../components/ServicesGrid";


export default function LandingPage() {

  const context = useContext(ProductsContext)
  const [newProducts, setNewProducts] = useState([])

  useEffect(() => {
    const fetchNewProducts = async () => {
      await getNewProducts()
    }

    fetchNewProducts();
  }, [])

  const getNewProducts = async () => {
    let response = await context.getNewProducts()

    setNewProducts(response)
    console.log(response)
  }

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 2 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };

  // <div className="new-arrivals p-5 mt-3">
  //       <h1 className="text-center" style={{fontFamily:"Righteous"}}>LATEST ARRIVALS</h1>
  //       <div >
  //         <Carousel responsive={responsive}>
  //           {newProducts ?
  //             newProducts.map(p => {
  //               return (
  //                 <Card style={{ cursor: "pointer", textDecoration: 'none', color: 'black' }} as={Link} to={`/products/${p.id}`} className="p-3">
  //                 <Card.Img variant="top" src={p.image_url} className="landing-card-img" />
  //                 <Card.Body>
  //                   <Card.Title>{p.name}</Card.Title>
  //                   <Card.Text>
  //                     {p.surface.surface} Boots <br />
  //                     {/* S$ {(p.cost / 100).toFixed(2)} */}
  //                   </Card.Text>
  //                 </Card.Body>
  //               </Card>
  //               )
  //             })
  //             : null}
  //         </Carousel>
  //       </div>
  //     </div>




  return (
    <Fragment>
      <div className="container">
      <div >
        <LandingCarousel />
      </div>

      

      <div>
        <ServicesGrid />
        {/* <h1 className="text-center my-3" style={{fontFamily:"Righteous"}}>SHOP BY SPORT</h1>
        <div className="row ">
          <a className="col-md-4 p-3" href="/shop/3">
            <img src="/images/floorball.png" style={{ width: "100%" }}></img>
          </a>
          <a className="col-md-4 p-3" href="/shop/2">
            <img src="/images/football.png" style={{ width: "100%" }}></img>
          </a>
          <a className="col-md-4 p-3" href="/shop/1">
            <img src="/images/basketball.png" style={{ width: "100%" }}></img>
          </a>
        </div> */}
      </div>
      <div style={{ height: "40px" }}></div>
      </div>
    </Fragment>
  )
}
