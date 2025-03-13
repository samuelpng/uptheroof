import { Fragment, useContext, useState } from 'react';
import CustomerContext from '../contexts/CustomerContext';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';

export default function AboutUs() {

  const context = useContext(CustomerContext)
  const navigate = useNavigate()
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     contact: '',
//     message: ''
//   })

  return (
    <Fragment>
      <Container>
        <div className="row mt-3">
          {/* <div className="form mx-auto col-md-6 col-lg-5 mt-4 p-4 shadow-lg" style={{ border: "1px solid lightslategray" }}> */}
            <h1 className="text-center" >About Us</h1>
            <img src="/images/sports-engineering-logo.png" style={{ width: "20%", marginLeft: "40%" }}></img>

            <div>
                <h5>Our company is experienced in solving complex sporting equipment issues and in representing our clients’ best interest . We have been providing our services to big events  like SEA Games, Youth Olympic Games, Asian Indoor & Martial Arts Game, FIBA 3x3 Asian Singapore etc. </h5>
                <h3>Mission</h3> 
                <h5>To offer every sport quality equipment, excellent service and creative solutions that bring out the best of athletes </h5>
                <h3>Vision</h3> 
                <h5>Elevate Sports for Every Athlete,  Everywhere </h5>
                

            </div>

            {/* <p class="text-center">Don't have an account? <a href="/register">Register here</a></p> */}
          </div>
        {/* </div> */}
      </Container>
    </Fragment>
  );
}
