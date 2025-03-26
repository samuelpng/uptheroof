import React, { Fragment, useEffect, useState, useContext } from "react";
import { Container, Button, CloseButton } from "react-bootstrap";
import { toast } from "react-toastify";
import { supabase } from "../supabaseClient"; 
import { useAuth } from "../contexts/AuthContext";
import { sendOrderEmail } from '../utils/emailService';

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
    }
  }, [user]);

  // Fetch cart items + related product details
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

  // Update local notes state as user types
  const handleNotesChange = (productId, newNotes) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? { ...item, notes: newNotes }
          : item
      )
    );
  };

  // Save notes to Supabase when user clicks 'Save'
  const saveNotes = async (productId) => {
    // Find the item whose notes we want to save
    const itemToSave = cartItems.find(
      (item) => item.product_id === productId
    );
    if (!itemToSave) return;

    // Update notes in the database
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
      // Optionally, you can refresh the cart or leave it as-is:
      // await getCartItems();
    }
  };

  // delete cart item function
  const deleteCartItem = async (productId) => {
    const { error: categoryError } = await supabase
      .from('profiles_products')
      .delete()
      .eq('product_id', productId)
      .eq('profile_id', user.id);

    if (categoryError) {
      console.error('Error deleting:', categoryError);
    } else {
      console.log('Successfully deleted');
      getCartItems()
    }

  };

  // Example checkout / inquire function
  const checkout = async () => {
    //update orders table

    //send email
    const orderDetails = {
      name: 'John Doe',
      email: user.email,
      total: 85,
    };
    
    // Call the function on checkout
    await sendOrderEmail(orderDetails);
  };

  return (
    <Fragment>
      <Container>
        <div className="row">
          <h1 className="px-5 text-center mt-4" style={{ fontFamily: "Righteous" }}>
            My Cart
          </h1>
          <h5
            className="px-5 text-center mt-4"
            style={{ fontFamily: "Righteous" }}
          >
            Review the items you’re interested in and submit an inquiry for pricing or more details.
          </h5>
          {loggedIn ? (
            <Fragment>
              {cartItems && cartItems.length !== 0 ? (
                <div className="row mt-3 px-4 px-lg-5">
                  <div className="col-12 col-lg-7">
                    {cartItems.map((c) => (
                      <div className="d-flex cartItem-container mb-3" key={c.id}>
                        <div className="col-5">
                          <img
                            src={c.products.image_url}
                            style={{ width: "100%" }}
                            alt={c.products.name}
                          />
                        </div>
                        <div className="col-6 ps-3 pt-2 pt-md-3">
                          <h4 className="cartItemName pe-1">{c.products.name}</h4>

                          {/* Always editable textarea for notes */}
                          <div>Additional Notes</div>
                          <textarea
                            value={c.notes || ""}
                            onChange={(e) =>
                              handleNotesChange(c.product_id, e.target.value)
                            }
                            placeholder="Add notes here..."
                            rows={4}
                            style={{ width: "100%" }}
                          />

                          {/* Save button to persist notes */}
                          <Button
                            variant="primary"
                            className="mt-2 me-2"
                            onClick={() => saveNotes(c.product_id)}
                          >
                            Save
                          </Button>

                          <CloseButton
                            style={{ position: "absolute", top: "10px", right: "10px" }}
                            onClick={() => deleteCartItem(c.product_id)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="col-12 col-lg-5 pt-4 ps-4">
                    <h4 className="mb-5">Order Summary</h4>
                    <div className="cartItem-container" style={{ border: "none" }}>
                      {cartItems.map((c) => (
                        <Fragment key={c.product_id}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>{c.products.name}</div>
                          </div>
                          <p className="mb-3">x{c.quantity}</p>
                        </Fragment>
                      ))}
                      <hr />  
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>Total</div>
                      </div>
                    </div>
                    <div className="d-grid my-4 mx-2">
                      <Button
                        variant="dark"
                        className="rounded-0 py-2"
                        type="button"
                        onClick={checkout}
                      >
                        ENQUIRE
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="py-4 lead text-center">
                  There are no items in your shopping cart
                </p>
              )}
            </Fragment>
          ) : (
            <div>
              <p className="py-4 lead text-center">
                Please log in to view or add items to your shopping cart.
              </p>
            </div>
          )}
        </div>
      </Container>
    </Fragment>
  );
}
