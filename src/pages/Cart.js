import React, { Fragment, useEffect, useState } from "react";
import { Container, Button, CloseButton, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import Swal from "sweetalert2";

export default function Cart() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("")

  const { user, isLoading } = useAuth();

  const promoCodes = ["#SYOFF",
    "#SGOFF",
    "#KENOFF",
    "#OOFF",
    "#JOOFF",
    "#SCHOFF",
  ];

useEffect(() => {
  if (isLoading) return; // Wait for auth to be ready

  if (user) {
    setLoggedIn(true);
    getCartItems();
  } else {
    setLoggedIn(false);
    getLocalCartItems();
    setLoading(false);
  }
}, [user, isLoading]);

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
    setLoading(false)
  };

  const getLocalCartItems = () => {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(localCart);
  };

  const handleNotesChange = (productId, newNotes) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product_id === productId ? { ...item, notes: newNotes } : item
      )
    );
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };
  

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase().includes(promoCode)) {
      setAppliedPromo(promoCode); 
      setPromoError("");
      toast.success("Promo code applied!");
    } else {
      setAppliedPromo(null);
      setPromoError("Invalid promo code.");
      toast.error("Promo code not valid.");
    }
  };

  // const saveNotes = async (productId) => {
  //   const itemToSave = cartItems.find((item) => item.product_id === productId);
  //   if (!itemToSave) return;

  //   const { error } = await supabase
  //     .from("profiles_products")
  //     .update({ notes: itemToSave.notes })
  //     .eq("profile_id", user.id)
  //     .eq("product_id", productId);

  //   if (error) {
  //     toast.error("Failed to update notes.");
  //     console.error(error);
  //   } else {
  //     toast.success("Notes updated successfully!");
  //   }
  // };

  const clearCart = async () => {
    const { error } = await supabase
      .from('profiles_products')
      .delete()
      .eq('profile_id', user.id);
  
    if (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart after order.");
    } else {
      setCartItems([]);
      toast.success("Cart cleared successfully!");
    }
  };

  const deleteCartItem = async (productId) => {
    const { error } = await supabase
      .from("profiles_products")
      .delete()
      .eq("product_id", productId)
      .eq("profile_id", user.id);

    if (error) {
      console.error("Error deleting:", error);
    } else {
      getCartItems();
    }
  };

  const removeLocalCartItem = (productId) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.filter((item) => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone) => {
    return /^[\d+\s\-().]{7,}$/.test(phone); // Allows common phone formats
  };

  const checkout = async () => {
  // Normalize cart items to have consistent product info
  const normalizedCart = cartItems.map(item => ({
    product_id: item.products?.id || item.product_id || item.id,
    quantity: item.quantity || 1,
    // add more fields if needed, e.g. price
  }));

  if (normalizedCart.length === 0) {
    toast.error("Your cart is empty!");
    return;
  }

  if (!loggedIn) {
    const { value: formValues } = await Swal.fire({
      title: "Contact Information",
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Email">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Name (optional)">` +
        `<input id="swal-input3" class="swal2-input" placeholder="Phone Number (optional)">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Submit",
      preConfirm: () => {
        const email = document.getElementById("swal-input1").value.trim();
        const name = document.getElementById("swal-input2").value.trim();
        const phone = document.getElementById("swal-input3").value.trim();

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

        return { email, name, phone };
      },
    });

    if (!formValues) return;
    
    const { email, name, phone } = formValues;

    const orderPayload = {
      contact_name: name || "Guest",
      contact_email: email,
      contact_phone: phone,
      message: message,
      promo_code: promoCode
    };

    try {
      // Insert order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert(orderPayload)
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      const itemsPayload = normalizedCart.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsPayload);

      if (itemsError) throw itemsError;

      toast.success("Order saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  } else {
    // Logged in user checkout flow here (if any)
    // For example, same order insertion with user info from `user`
    try {
      const orderPayload = {
        profile_id: user.id,
        contact_name: user.user_metadata?.full_name || user.email,
        contact_email: user.email,
        contact_phone: user.user_metadata?.phone || null,
        message: message,
        promo_code: promoCode
      };

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert(orderPayload)
        .select()
        .single();

      if (orderError) throw orderError;
      const itemsPayload = normalizedCart.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        // quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsPayload);

      if (itemsError) throw itemsError;

      clearCart();

      toast.success("Order saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  }
};


  if (loading) {
    return <></>
  }

  return (
    <Fragment>
      <Container>
        <div className="row">
          <h1
            className="px-5 text-center mt-4"
            style={{ fontFamily: "Righteous" }}
          >
            My Cart
          </h1>
          <h5
            className="px-5 text-center mt-4"
            style={{ fontFamily: "Righteous" }}
          >
            Review the items you’re interested in and submit an inquiry for
            pricing or more details.
          </h5>

          {cartItems && cartItems.length !== 0 ? (
            <div className="row mt-3 px-4 px-lg-5">
              <div className="col-12 col-lg-7">
                {cartItems.map((c, index) => (
                  <div
                    className="d-flex flex-wrap mb-3 p-3 border rounded position-relative"
                    style={{ minHeight: "200px" }}
                    key={c.id || index}
                  >
                    <div className="col-12 col-md-4 d-flex align-items-center justify-content-center">
                      <img
                        src={loggedIn ? c.products.image_url : c.image_url}
                        alt={loggedIn ? c.products.name : c.name}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "150px",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-8 pt-3 pt-md-0 ps-md-4 d-flex flex-column justify-content-between">
                      <div>
                        <h4 className="cartItemName pe-1">
                          {loggedIn ? c.products.name : c.name}
                        </h4>
                        {loggedIn && (
                          <Fragment>
                            {/* <div className="mt-2">Additional Notes</div>
                            <textarea
                              value={c.notes || ""}
                              onChange={(e) =>
                                handleNotesChange(c.product_id, e.target.value)
                              }
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
                            </Button> */}
                          </Fragment>
                        )}
                      </div>
                    </div>
                    <CloseButton
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                      }}
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
                    {/* <div>Total</div> */}
                    <div>-</div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="promoCode" className="form-label">
                      Promo Code
                    </label>
                    <div className="d-flex">
                      <input
                        id="promoCode"
                        type="text"
                        className="form-control me-2"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                      />
                      <Button variant="secondary" onClick={handleApplyPromo}>
                        Apply
                      </Button>
                    </div>
                    {promoError && (
                      <small className="text-danger">{promoError}</small>
                    )}
                    {appliedPromo && (
                      <div className="text-success mt-2">
                        Promo <strong>{appliedPromo.code}</strong> applied:{" "}
                        {/* {appliedPromo.discount * 100}% off */}
                      </div>
                    )}
                  </div>
                  <div>
                    <Form.Group controlId="message" className="mb-3">
                      <Form.Label>Message</Form.Label>
                      <Form.Control as="textarea" rows={4} name="message" value={message} onChange={handleMessageChange} required />
                    </Form.Group>
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
