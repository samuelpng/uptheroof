import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { supabase } from "../supabaseClient";


const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    
    const { data, error } = await supabase.from("contact_us").insert([{ 
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message
    }]);
    
    if (error) {
      setStatus("Failed to send message. Please try again.");
    } else {
      setStatus("Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });
    }
  };

  return (
    <Container className="site-section">
      <Row className="text-center mb-4">
        <Col>
          <h2 className="section-title">Contact Us</h2>
          <p className="section-subtitle">We'd love to hear from you! Reach out to us for any inquiries.</p>
        </Col>
      </Row>
      <Row className="mb-4 g-4">
        <Col md={6}>
          <div className="page-panel h-100">
            <h4>Get in Touch</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="name" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
              </Form.Group>
              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Form.Group>
              <Form.Group controlId="phone" className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} required />
              </Form.Group>
              <Form.Group controlId="message" className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control as="textarea" rows={4} name="message" value={formData.message} onChange={handleChange} required />
              </Form.Group>
              <Button className="btn-brand" type="submit">Send Message</Button>
            </Form>
            {status && <p className="mt-3 mb-0">{status}</p>}
          </div>
        </Col>
        <Col md={6}>
          <div className="page-panel h-100">
            <h4>Contact Information</h4>
            <p><strong>Email:</strong> ejsportseng@gmail.com<br />batam@ejsports.com.sg</p>
            <p><strong>Phone:</strong> (+65) 8444 2590</p>
            <p>
              <strong>Address:</strong><br />
              12 Tampines North Drive 4, #06-25,<br />
              Stellar @ Tampines<br />
              Singapore 529435
            </p>
            <h4>Follow Us</h4>
            <p className="mb-0">
              <a href="https://www.instagram.com/ejsportsengine/profilecard/?igsh=YXpjeHR6dGRqcWk4">Instagram</a>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactUs;
