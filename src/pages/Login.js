import { Fragment, useContext, useState, useEffect } from "react";
import CustomerContext from "../contexts/CustomerContext";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth(); // Get auth functions from context
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const updateFormField = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    let email = formData.email;
    let password = formData.password;

    let response = await login(email, password);
    console.log("login =>", response);

    if (response?.error) {
      Swal.fire("Error", response.error.message, "error");
    } else {
      Swal.fire("Success!", "You are now logged in.", "success");
      navigate("/");
    }
  };

  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: "Reset Password",
      input: "email",
      inputLabel: "Enter your email",
      inputPlaceholder: "example@email.com",
      showCancelButton: true,
      confirmButtonText: "Send Reset Link",
    });

    if (email) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:3000/login", // Fixed URL
      });

      if (error) {
        Swal.fire("Error", error.message, "error");
      } else {
        Swal.fire("Success!", "A password reset link has been sent to your email.", "success");
      }
    }
  };

  useEffect(() => {
    const checkPasswordReset = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        const { value: newPassword } = await Swal.fire({
          title: "Reset Your Password",
          input: "password",
          inputLabel: "Enter new password",
          inputPlaceholder: "New password",
          inputAttributes: { type: "password" },
          showCancelButton: false,
          confirmButtonText: "Update Password",
        });

        if (newPassword) {
          const { error } = await supabase.auth.updateUser({ password: newPassword });

          if (error) {
            Swal.fire("Error", error.message, "error");
          } else {
            Swal.fire("Success!", "Your password has been updated. Please log in.", "success");
            await supabase.auth.signOut();
          }
        }
      }
    };

    checkPasswordReset();
  }, []);

  return (
    <Fragment>
      <Container>
        <div className="row mt-3">
          <div className="form mx-auto col-md-6 col-lg-5 mt-4 p-4 shadow-lg" style={{ border: "1px solid lightslategray" }}>
            <h1 className="text-center" style={{ fontFamily: "Righteous" }}>Sign In</h1>
            <img src="/images/sports-engineering-logo.png" style={{ width: "50%", marginLeft: "25%" }} alt="Logo" />

            <Form className="register-form my-4">
              <Form.Control
                type="email"
                name="email"
                className="form-input bg-transparent rounded-0 mb-3"
                placeholder="Email"
                value={formData.email}
                onChange={updateFormField}
              />
              <Form.Control
                type="password"
                name="password"
                className="form-input bg-transparent rounded-0 mb-3"
                placeholder="Password"
                value={formData.password}
                onChange={updateFormField}
              />

              <div className="d-grid mt-4">
                <Button variant="dark" className="rounded-0 py-2" type="button" onClick={handleLogin}>
                  SIGN IN
                </Button>
              </div>
            </Form>
            <p className="text-center">
              Don't have an account? <a href="/register">Register here</a>
            </p>
            <p className="text-center">
              Forgot your password?{" "}
              <a onClick={handleForgotPassword} style={{ cursor: "pointer" }}>
                Click here to reset your password
              </a>
            </p>
          </div>
        </div>
      </Container>
    </Fragment>
  );
}
