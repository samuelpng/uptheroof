import React, { Fragment, useEffect, useState } from "react";
import { Container, Button, CloseButton } from "react-bootstrap";
import { toast } from "react-toastify";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import { sendOrderEmail } from '../utils/emailService';
import Swal from 'sweetalert2';

export default function Cart() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setLoggedIn(true);
      getCartItems();
    } else {
      setLoggedIn(false);
      getLocalCartItems();
    }
  }, [user]);

  const getCartItems = async () => {
    const { data, error } = await supabase
      .from("profiles_products")
      .select(`*, products(*)`)
      .eq("profile_id", user.id);

    if (error) {
      console.error(error);
      return;
    }

    setCartItems(data);
  };

  const getLocalCartItems = () => {
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(localCart);
  };

  const handleNotesChange = (productId, newNotes) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product_id === productId ? { ...item, notes: newNotes } : item
      )
    );
  };

  const saveNotes = async (productId) => {
    const itemToSave = cartItems.find((item) => item.product_id === productId);
    if (!itemToSave) return;

    const { error } = await supabase
      .from("profiles_products")
      .update({ notes: itemToSave.notes })
      .eq("profile_id", user.id)
      .eq("product_id", productId);

    if (error) {
      toast.error("Failed to update notes.");
      console.error(error);
    } else {
      toast.success("Notes updated successfully!");
    }
  };

  const deleteCartItem = async (productId) => {
    const { error } = await supabase
      .from('profiles_products')
      .delete()
      .eq('product_id', productId)
      .eq('profile_id', user.id);

    if (error) {
      console.error('Error deleting:', error);
    } else {
      getCartItems();
    }
  };

  const removeLocalCartItem = (productId) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhone = (phone) => {
  return /^[\d+\s\-().]{7,}$/.test(phone); // Allows common phone formats
};

const checkout = async () => {
  if (!loggedIn) {
    const { value: formValues } = await Swal.fire({
      title: 'Contact Information',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Email (optional)">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Phone Number (optional)">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      preConfirm: () => {
        const email = document.getElementById('swal-input1').value.trim();
        const phone = document.getElementById('swal-input2').value.trim();

        if (!email && !phone) {
          Swal.showValidationMessage("Please enter at least one contact method.");
          return false;
        }

        if (email && !isValidEmail(email)) {
          Swal.showValidationMessage("Please enter a valid email address.");
          return false;
        }

        if (phone && !isValidPhone(phone)) {
          Swal.showValidationMessage("Please enter a valid phone number.");
          return false;
        }

        return { email, phone };
      }
    });

    if (!formValues) return;

    const { email, phone } = formValues;

    const orderDetails = {
      name: "Guest",
      email,
      phone,
      items: cartItems,
    };

    await sendOrderEmail(orderDetails);
    toast.success("Inquiry sent!");
    return;
  }

  const orderDetails = {
    name: user.user_metadata.full_name || "Guest",
    email: user.email,
    items: cartItems,
  };

  await sendOrderEmail(orderDetails);
  toast.success("Inquiry sent!");
};


  return (
    <Fragment>
      <Container>
        <div className="row">
          <h1 className="px-5 text-center mt-4" style={{ fontFamily: "Righteous" }}>My Cart</h1>
          <h5 className="px-5 text-center mt-4" style={{ fontFamily: "Righteous" }}>
            Review the items you’re interested in and submit an inquiry for pricing or more details.
          </h5>

          {cartItems && cartItems.length !== 0 ? (
            <div className="row mt-3 px-4 px-lg-5">
              <div className="col-12 col-lg-7">
                {cartItems.map((c, index) => (
                  <div className="d-flex flex-wrap mb-3 p-3 border rounded position-relative" style={{ minHeight: "200px" }} key={c.id || index}>
                    <div className="col-12 col-md-4 d-flex align-items-center justify-content-center">
                      <img
                        src={loggedIn ? c.products.image_url : c.image_url}
                        alt={loggedIn ? c.products.name : c.name}
                        style={{ maxWidth: "100%", maxHeight: "150px", objectFit: "contain" }}
                      />
                    </div>
                    <div className="col-12 col-md-8 pt-3 pt-md-0 ps-md-4 d-flex flex-column justify-content-between">
                      <div>
                        <h4 className="cartItemName pe-1">
                          {loggedIn ? c.products.name : c.name}
                        </h4>
                        {loggedIn && (
                          <Fragment>
                            <div className="mt-2">Additional Notes</div>
                            <textarea
                              value={c.notes || ""}
                              onChange={(e) => handleNotesChange(c.product_id, e.target.value)}
                              placeholder="Add notes here..."
                              rows={3}
                              className="form-control"
                            />
                            <Button
                              variant="primary"
                              className="mt-2"
                              size="sm"
                              onClick={() => saveNotes(c.product_id)}
                            >
                              Save
                            </Button>
                          </Fragment>
                        )}
                      </div>
                    </div>
                    <CloseButton
                      style={{ position: "absolute", top: "10px", right: "10px" }}
                      onClick={() =>
                        loggedIn
                          ? deleteCartItem(c.product_id)
                          : removeLocalCartItem(c.id)
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="col-12 col-lg-5 pt-4 ps-4">
                <h4 className="mb-4">Order Summary</h4>
                <div className="border p-3 rounded">
                  {cartItems.map((c, index) => (
                    <Fragment key={c.product_id || c.id || index}>
                      <div className="d-flex justify-content-between mb-2">
                        <div>{loggedIn ? c.products.name : c.name}</div>
                        <div>x{c.quantity || 1}</div>
                      </div>
                    </Fragment>
                  ))}
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <div>Total</div>
                    <div>-</div>
                  </div>
                  <Button
                    variant="dark"
                    className="mt-4 w-100 py-2"
                    onClick={checkout}
                  >
                    ENQUIRE
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="py-4 lead text-center">
              Your shopping cart is empty.
            </p>
          )}
        </div>
      </Container>
    </Fragment>
  );
}
