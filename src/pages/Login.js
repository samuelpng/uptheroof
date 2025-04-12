import { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const updateFormField = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    const { email, password } = formData;

    const response = await login(email, password);
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
        redirectTo: "http://localhost:3000/login", // Change for prod!
      });

      if (error) {
        Swal.fire("Error", error.message, "error");
      } else {
        Swal.fire("Success!", "A password reset link has been sent to your email.", "success");
      }
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      Swal.fire("Error", error.message, "error");
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
        <div className="row justify-content-center mt-5">
          <div className="col-md-6 col-lg-5 p-4 shadow-sm border rounded bg-white">
            <h2 className="text-center mb-4">Sign In</h2>

            <Form>
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={updateFormField}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={updateFormField}
                />
              </Form.Group>

              <div className="d-grid mb-3">
                <Button variant="primary" onClick={handleLogin}>
                  Sign In
                </Button>
              </div>

              {/* <div className="d-grid mb-3">
                <Button variant="outline-dark" onClick={handleGoogleLogin}>
                  Sign In with Google
                </Button>
              </div> */}
            </Form>

            <p className="text-center mt-3">
              Don’t have an account? <a href="/register">Register</a>
            </p>
            <p className="text-center">
              <a onClick={handleForgotPassword} style={{ cursor: "pointer" }}>
                Forgot password?
              </a>
            </p>
          </div>
        </div>
      </Container>
    </Fragment>
  );
}
