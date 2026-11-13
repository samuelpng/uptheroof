import { Fragment, useEffect, useState } from "react";
import { Button, Container, Form, Modal, Table } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { supabase } from "../../supabaseClient";

export default function AdminAddSport() {
  const navigate = useNavigate();
  const [sports, setSports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchSports = async () => {
    const { data, error: fetchError } = await supabase
      .from("sports")
      .select("id, sport_name")
      .order("sport_name", { ascending: true });

    if (fetchError) {
      console.error("Error fetching sports:", fetchError.message);
      Swal.fire("Error", "Failed to load sports.", "error");
    } else {
      setSports(data || []);
    }
  };

  useEffect(() => {
    fetchSports();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setName("");
    setError("");
    setShowModal(true);
  };

  const openEdit = (sport) => {
    setEditingId(sport.id);
    setName(sport.sport_name || "");
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
      setError("Sport name is required.");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const { error: updateError } = await supabase
          .from("sports")
          .update({ sport_name: trimmed })
          .eq("id", editingId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("sports")
          .insert([{ sport_name: trimmed }]);
        if (insertError) throw insertError;
      }

      Swal.fire("Saved", "Sport saved successfully.", "success");
      closeModal();
      fetchSports();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Failed to save sport.", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteSport = async (id) => {
    const { count, error: countError } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("sport_id", id);

    if (countError) {
      console.error(countError);
      Swal.fire("Error", "Failed to check products using this sport.", "error");
      return;
    }

    if (count > 0) {
      Swal.fire(
        "Cannot delete",
        `This sport is used by ${count} product(s). Reassign those products first.`,
        "warning"
      );
      return;
    }

    const { error: deleteError } = await supabase.from("sports").delete().eq("id", id);

    if (deleteError) {
      Swal.fire("Error", "Failed to delete sport.", "error");
    } else {
      Swal.fire("Deleted!", "The sport has been deleted.", "success");
      fetchSports();
    }
  };

  const handleDelete = (sport) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete "${sport.sport_name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSport(sport.id);
      }
    });
  };

  return (
    <Fragment>
      <div className="admin-shell">
      <Container>
        <div className="admin-header">
          <h1 className="mb-0" style={{ fontFamily: "Righteous" }}>
            Manage Sports
          </h1>
          <div>
            <Button variant="outline-secondary" className="me-2" onClick={() => navigate("/admin")}>
              Admin Home
            </Button>
            <Button className="btn-brand" onClick={openCreate}>
              <FaPlus /> Add Sport
            </Button>
          </div>
        </div>

        <div className="admin-table">
        <Table responsive hover className="mb-0">
          <thead>
            <tr>
              <th>Sport</th>
              <th style={{ width: "120px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sports.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-center text-muted">
                  No sports yet.
                </td>
              </tr>
            ) : (
              sports.map((sport) => (
                <tr key={sport.id}>
                  <td>{sport.sport_name}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => openEdit(sport)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(sport)}
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
          <Modal.Title>{editingId ? "Edit Sport" : "Add Sport"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Sport name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Basketball"
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
