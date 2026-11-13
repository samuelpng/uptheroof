import { Fragment, useEffect, useState } from "react";
import { Button, Container, Form, Modal, Table } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ImageUploader from "../../components/ImageUploader";
import { supabase } from "../../supabaseClient";

const emptyForm = {
  title: "",
  image_url: "",
  button_text: "",
  button_link: "",
  sort_order: 0,
  is_active: true,
};

const getSafeStoragePath = (originalName) => {
  const extMatch = originalName.match(/\.([a-zA-Z0-9]+)$/);
  const ext = extMatch ? extMatch[1].toLowerCase() : "jpg";
  const uniqueId = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  return `5sa3j8_1/carousel/${uniqueId}.${ext}`;
};

export default function AdminCarousel() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchSlides = async () => {
    const { data, error } = await supabase
      .from("carousel_slides")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching slides:", error.message);
      Swal.fire("Error", "Failed to load carousel slides.", "error");
    } else {
      setSlides(data || []);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setFormData({
      ...emptyForm,
      sort_order: slides.length > 0 ? Math.max(...slides.map((s) => s.sort_order)) + 1 : 1,
    });
    setImages([]);
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (slide) => {
    setEditingId(slide.id);
    setFormData({
      title: slide.title || "",
      image_url: slide.image_url || "",
      button_text: slide.button_text || "",
      button_link: slide.button_link || "",
      sort_order: slide.sort_order ?? 0,
      is_active: slide.is_active ?? true,
    });
    setImages([]);
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(emptyForm);
    setImages([]);
    setErrors({});
  };

  const updateField = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const uploadImage = async () => {
    if (images.length === 0) return null;

    const file = images[0].file;
    const fileName = getSafeStoragePath(file.name);

    const { error } = await supabase.storage.from("EJsports").upload(fileName, file);
    if (error) {
      throw new Error(error.message);
    }

    const { data: publicUrl } = supabase.storage.from("EJsports").getPublicUrl(fileName);
    return publicUrl.publicUrl;
  };

  const validate = () => {
    const next = {};
    if (!formData.title.trim()) next.title = "Title is required.";
    if (!editingId && images.length === 0 && !formData.image_url) {
      next.image = "Please upload an image.";
    }
    if (editingId && images.length === 0 && !formData.image_url) {
      next.image = "Please upload an image.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      let imageUrl = formData.image_url;
      if (images.length > 0) {
        imageUrl = await uploadImage();
      }

      const payload = {
        title: formData.title.trim(),
        image_url: imageUrl,
        button_text: formData.button_text.trim() || null,
        button_link: formData.button_link.trim() || null,
        sort_order: Number(formData.sort_order) || 0,
        is_active: Boolean(formData.is_active),
      };

      if (editingId) {
        const { error } = await supabase
          .from("carousel_slides")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("carousel_slides").insert([payload]);
        if (error) throw error;
      }

      Swal.fire("Saved", "Carousel slide saved successfully.", "success");
      closeModal();
      fetchSlides();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Failed to save slide.", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteSlide = async (id) => {
    const { error } = await supabase.from("carousel_slides").delete().eq("id", id);
    if (error) {
      Swal.fire("Error", "Failed to delete slide.", "error");
    } else {
      Swal.fire("Deleted!", "The slide has been deleted.", "success");
      fetchSlides();
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSlide(id);
      }
    });
  };

  return (
    <Fragment>
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h1 className="mb-0" style={{ fontFamily: "Righteous" }}>
            Manage Carousel
          </h1>
          <div>
            <Button variant="secondary" className="me-2" onClick={() => navigate("/admin")}>
              Admin Home
            </Button>
            <Button variant="dark" onClick={openCreate}>
              <FaPlus /> Add Slide
            </Button>
          </div>
        </div>

        <Table responsive bordered hover>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Button</th>
              <th>Order</th>
              <th>Active</th>
              <th style={{ width: "120px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slides.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-muted">
                  No slides yet. Add one to show on the homepage.
                </td>
              </tr>
            ) : (
              slides.map((slide) => (
                <tr key={slide.id}>
                  <td>
                    <img
                      src={slide.image_url}
                      alt={slide.title}
                      style={{ width: 80, height: 50, objectFit: "cover" }}
                    />
                  </td>
                  <td>{slide.title}</td>
                  <td>
                    {slide.button_text ? (
                      <span>
                        {slide.button_text}
                        {slide.button_link ? (
                          <span className="text-muted"> → {slide.button_link}</span>
                        ) : null}
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>{slide.sort_order}</td>
                  <td>{slide.is_active ? "Yes" : "No"}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => openEdit(slide)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(slide.id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Container>

      <Modal show={showModal} onHide={closeModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? "Edit Slide" : "Add Slide"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={formData.title}
                onChange={updateField}
                placeholder="e.g. GOALPOSTS"
              />
              {errors.title && <div className="text-danger">{errors.title}</div>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              {formData.image_url && images.length === 0 && (
                <div className="mb-2">
                  <img
                    src={formData.image_url}
                    alt="Current"
                    style={{ maxWidth: "100%", maxHeight: 180, objectFit: "contain" }}
                  />
                  <div className="text-muted small">Upload a new image to replace this one.</div>
                </div>
              )}
              <ImageUploader images={images} onImageUpload={setImages} maxImages={1} />
              {errors.image && <div className="text-danger">{errors.image}</div>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Button text (optional)</Form.Label>
              <Form.Control
                name="button_text"
                value={formData.button_text}
                onChange={updateField}
                placeholder="e.g. Shop Now"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Button link (optional)</Form.Label>
              <Form.Control
                name="button_link"
                value={formData.button_link}
                onChange={updateField}
                placeholder="e.g. /products/3 or /shop"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sort order</Form.Label>
              <Form.Control
                type="number"
                name="sort_order"
                value={formData.sort_order}
                onChange={updateField}
              />
            </Form.Group>

            <Form.Check
              type="checkbox"
              name="is_active"
              label="Active (show on homepage)"
              checked={formData.is_active}
              onChange={updateField}
            />
          </Form>
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
