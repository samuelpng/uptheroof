import { Fragment, useEffect, useState } from "react";
import { Button, Container, Form, Modal, Table } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { supabase } from "../../supabaseClient";

export default function AdminAddCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    const { data, error: fetchError } = await supabase
      .from("categories")
      .select("id, category_name")
      .order("category_name", { ascending: true });

    if (fetchError) {
      console.error("Error fetching categories:", fetchError.message);
      Swal.fire("Error", "Failed to load categories.", "error");
    } else {
      setCategories(data || []);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setName("");
    setError("");
    setShowModal(true);
  };

  const openEdit = (category) => {
    setEditingId(category.id);
    setName(category.category_name || "");
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setName("");
    setError("");
  };

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Category name is required.");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const { error: updateError } = await supabase
          .from("categories")
          .update({ category_name: trimmed })
          .eq("id", editingId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("categories")
          .insert([{ category_name: trimmed }]);
        if (insertError) throw insertError;
      }

      Swal.fire("Saved", "Category saved successfully.", "success");
      closeModal();
      fetchCategories();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Failed to save category.", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id) => {
    const { error: linkError } = await supabase
      .from("products_categories")
      .delete()
      .eq("category_id", id);

    if (linkError) {
      console.error(linkError);
      Swal.fire("Error", "Failed to remove category from products.", "error");
      return;
    }

    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (deleteError) {
      Swal.fire("Error", "Failed to delete category.", "error");
    } else {
      Swal.fire("Deleted!", "The category has been deleted.", "success");
      fetchCategories();
    }
  };

  const handleDelete = (category) => {
    Swal.fire({
      title: "Are you sure?",
      text: `"${category.category_name}" will be removed from all products.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCategory(category.id);
      }
    });
  };

  return (
    <Fragment>
      <div className="admin-shell">
      <Container>
        <div className="admin-header">
          <h1 className="mb-0" style={{ fontFamily: "Righteous" }}>
            Manage Categories
          </h1>
          <div>
            <Button variant="outline-secondary" className="me-2" onClick={() => navigate("/admin")}>
              Admin Home
            </Button>
            <Button className="btn-brand" onClick={openCreate}>
              <FaPlus /> Add Category
            </Button>
          </div>
        </div>

        <div className="admin-table">
        <Table responsive hover className="mb-0">
          <thead>
            <tr>
              <th>Category</th>
              <th style={{ width: "120px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-center text-muted">
                  No categories yet.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.category_name}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => openEdit(category)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(category)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
        </div>
      </Container>
      </div>

      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? "Edit Category" : "Add Category"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Category name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Flooring"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
            {error && <div className="text-danger mt-1">{error}</div>}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal} disabled={saving}>
            Cancel
          </Button>
          <Button variant="dark" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}
