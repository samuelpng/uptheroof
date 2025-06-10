import React, { Fragment, useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { supabase } from "../../supabaseClient";
import { toast } from "react-toastify";

export default function AdminOrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('fetch');
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      console.log("Fetching orders...");
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            products (
              name,
              image_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Fetched orders:", data);
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;
      
      toast.success("Order status updated successfully");
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center mt-5">Loading orders...</div>
      </Container>
    );
  }

  console.log("Current orders state:", orders);

  return (
    <Fragment>
      <Container className="mt-4">
        <h2 className="text-center mb-4" style={{ fontFamily: "Righteous" }}>
          Order Management
        </h2>
        
        {orders.length === 0 ? (
          <div className="text-center mt-4">
            <p>No orders found.</p>
          </div>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                {/* <th>Order ID</th> */}
                <th>Customer</th>
                <th>Contact Info</th>
                <th>Total Amount</th>
                <th>Items</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  {/* <td>#{order.id}</td> */}
                  <td>{order.contact_name || "Guest"}</td>
                  <td>
                    {order.contact_email && <div>Email: {order.contact_email}</div>}
                    {order.contact_phone && <div>Phone: {order.contact_phone}</div>}
                  </td>
                  <td>{order.total_amount ? `$${parseFloat(order.total_amount).toFixed(2)}` : 'N/A'}</td>
                  <td>
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="mb-2">
                        <img
                          src={item.products?.image_url}
                          alt={item.products?.name}
                          style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "10px" }}
                        />
                        {item.products?.name} (Qty: {item.quantity || 1})
                        {item.notes && <div className="text-muted small">Notes: {item.notes}</div>}
                      </div>
                    ))}
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </Fragment>
  );
}
