import { Fragment, useContext, useState } from 'react';
import CustomerContext from '../../contexts/CustomerContext';
import '../../App.css';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import { supabase } from '../../supabaseClient';

export default function AdminAddSport() {

  const context = useContext(CustomerContext)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    sport: ''
  })

  const updateFormField = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const addSport = async () => {
    let sport = formData.sport
  
    // Insert sport details into `sports` table
    const { data, error } = await supabase.from("sports").insert([
      {
        sport_name: sport,
      },
    ]).select();
  
    if (error) console.error("Error inserting sport:", error.message);
    else console.log("Sport added:", data[0].sport_name);
  };

  return (
    <Fragment>
      <Container>
        <div className="row mt-3">
          <div className="form mx-auto col-md-6 col-lg-5 mt-4 p-4 shadow-lg" style={{ border: "1px solid lightslategray" }}>
            <h1 className="text-center" style={{ fontFamily: "Righteous" }}>Add Sports</h1>

            <Form className="register-form my-4">
              <Form.Control type="text" name="sport" className="form-input bg-transparent rounded-0 mb-3"
                placeholder="Sport" value={formData.sport} onChange={updateFormField} />

              <div className="d-grid mt-4">
                <Button variant="dark" className="rounded-0 py-2" type="button" onClick={addSport}>SUBMIT</Button>
              </div>
            </Form>
            {/* <p class="text-center">Don't have an account? <a href="/register">Register here</a></p> */}
          </div>
        </div>
      </Container>
    </Fragment>
  );
}
