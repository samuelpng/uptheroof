import { Fragment, useContext, useState } from 'react';
import CustomerContext from '../../contexts/CustomerContext';
import '../../App.css';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import { supabase } from '../../supabaseClient';

export default function AdminAddCategories() {

  const context = useContext(CustomerContext)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    categories: ''
  })

  const updateFormField = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const addCategories = async () => {
    let categories = formData.categories
  
    // Insert categories details into `categoriess` table
    const { data, error } = await supabase.from("categories").insert([
      {
        category_name: categories,
      },
    ]).select();
  
    if (error) console.error("Error inserting sport:", error.message);
    else console.log("Categories added:", data[0].category_name);
  };

  return (
    <Fragment>
      <Container>
        <div className="row mt-3">
          <div className="form mx-auto col-md-6 col-lg-5 mt-4 p-4 shadow-lg" style={{ border: "1px solid lightslategray" }}>
            <h1 className="text-center" style={{ fontFamily: "Righteous" }}>Add Categories</h1>

            <Form className="register-form my-4">
              <Form.Control type="text" name="categories" className="form-input bg-transparent rounded-0 mb-3"
                placeholder="Categories" value={formData.sport} onChange={updateFormField} />

              <div className="d-grid mt-4">
                <Button variant="dark" className="rounded-0 py-2" type="button" onClick={addCategories}>SUBMIT</Button>
              </div>
            </Form>
          </div>
        </div>
      </Container>
    </Fragment>
  );
}
