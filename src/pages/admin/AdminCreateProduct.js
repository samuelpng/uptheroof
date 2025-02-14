import { Fragment, useContext, useState } from "react";
import CustomerContext from "../../contexts/CustomerContext";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, FormSelect } from "react-bootstrap";
import { supabase } from "../../supabaseClient";
import { useEffect } from "react";
import React from "react";
import Select from "react-select";
import ImageUploader from "../../components/ImageUploader";
import Swal from 'sweetalert2'

export default function AdminCreate() {
  const context = useContext(CustomerContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    sport: undefined,
    categories: [],
    description: "",
  });
  const [sports, setSports] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchSports();
    fetchCategories();
  }, []);

  const reset = () => {
    setFormData({
        name: "",
        sport: undefined,
        categories: [],
        description: "",
      })
      setSelectedCategories([])
      setImages([])
      setUploadedImages([])
  }

  const updateFormField = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchSports = async () => {
    const { data, error } = await supabase.from("sports").select("*");

    if (error) {
      console.error("Error fetching sports:", error.message);
    } else {
      console.log("sports:", data);
      setSports(data);
    }
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");

    if (error) {
      console.error("Error fetching categories:", error.message);
    } else {
      console.log("categories:", data);
      setCategories(data);
    }
  };

  const formattedOptions = categories.map((opt) => ({
    value: opt.id,
    label: opt.category_name,
  }));

  const handleCategoriesChange = (selected) => {
    setSelectedCategories(selected);
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = "Product name is required.";
    if (!formData.sport) errors.sport = "Please select a sport.";
    if (selectedCategories.length === 0) errors.categories = "Select at least one category.";
    if (images.length === 0) errors.images = "Upload at least one image.";

    setErrors(errors);
    return Object.keys(errors).length === 0; // Returns true if no errors
  };

  const createProduct = async () => {
    validateForm()

    // Wait for images to finish uploading before proceeding
    const uploadedUrls = await uploadToSupabase(); 

    console.log("uploaded image", uploadedUrls);

    if (!uploadedUrls || uploadedUrls.length === 0) {
        console.error("No images uploaded!");
        return;
    }

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name: formData.name,
          sport_id: formData.sport,
          description: formData.description || null,
          image_url: uploadedUrls[0] || null,
          image_url2: uploadedUrls[1] || null,
          image_url3: uploadedUrls[2] || null,
        },
      ])
      .select(); // Select returns the inserted row(s)

    if (error) {
      console.error("Error inserting product:", error);
      return;
    }

    const productId = data?.[0]?.id; // Retrieve 'id' from 'products'

    if (!productId) {
      console.error("No product ID returned.");
      return;
    }

    // Insert categories
    const categories = selectedCategories;

    // const categoryInserts = categories.map((categoryId) => ({
    //   product_id: productId,
    //   category_id: categoryId,
    // }));

    const categoryInserts = selectedCategories.map(({ value }) => ({
        product_id: productId,
        category_id: value,
      }));

    const { data: data2, error: error2 } = await supabase
      .from("products_categories")
      .insert(categoryInserts);

    if (error2) {
      console.error("Error inserting categories:", error2);
    } else {
      console.log("Successfully inserted categories:", data2);
    }

    //product created successfully, alert user
    // Swal.fire({
    //     title: `${formData.name} successfully created`,
    //     icon: "success",
    //     draggable: true
    //   });
    Swal.fire({
        title: `${formData.name} successfully created`,
        icon: "success",
        html: `
          <img src="${uploadedUrls[0]}" alt="Preview" style="width: 100px; border-radius: 5px;" />
        `,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: "Add another Product",
        confirmButtonAriaLabel: "Add another Product",
        cancelButtonText: "Back to Home screen",
      }).then((result) => {
        if (result.isConfirmed) {
          // Action when "Add another Product" button is clicked
          console.log("User wants to add another product");
          // For example, reset form fields:
          reset()
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // Action when "Back to Home screen" button is clicked
          console.log("User is going back to home screen");
          navigate("/admin/list"); // Redirect user to home screen
        }
      });
      
      
    reset();
};

// Upload multiple images to Supabase
const uploadToSupabase = async () => {
    //if no images, do not have to upload
    if (images.length === 0) {
        return [];
    }

    setUploading(true);
    const uploadedUrls = [];
    
    for (const item of images) {
        const file = item.file;
        const fileName = `5sa3j8_1/${Date.now()}_${file.name}`;

        const { data, error } = await supabase.storage
            .from("EJsports") // Replace with your Supabase bucket name
            .upload(fileName, file);

        if (error) {
            alert("Upload failed: " + error.message);
            setUploading(false);
            return [];
        }

        // Get public URL
        const { data: publicUrl } = supabase.storage
            .from("EJsports")
            .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl.publicUrl);
    }

    setUploadedImages(uploadedUrls);
    setUploading(false);

    return uploadedUrls; // Return uploaded URLs
};


  const handleImageUpload = (newImages) => {
    setImages(newImages);
  };

  return (
    <Fragment>
      <Container>
        <div className="row mt-3">
          <div
            className="form mx-auto col-md-6 col-lg-5 mt-4 p-4 shadow-lg"
            style={{ border: "1px solid lightslategray" }}
          >
            <h1 className="text-center" style={{ fontFamily: "Righteous" }}>
              Add Product
            </h1>

            <Form className="register-form my-4">
              <Form.Control
                type="text"
                name="name"
                className="form-input bg-transparent rounded-0"
                placeholder="Full Name"
                value={formData.name}
                onChange={updateFormField}
              />
              {errors.name && <div className="text-danger">{errors.name}</div>}

              <Form.Select
                type="select"
                name="sport"
                className="form-input bg-transparent rounded-0 mt-3"
                placeholder="Sport"
                value={formData.sport}
                onChange={updateFormField}
              >
                <option value="">Select a sport</option>
                {sports.map((s, index) => (
                  <option key={index} value={s.id}>
                    {s.sport_name}
                  </option>
                ))}
              </Form.Select>
              {errors.sport && <div className="text-danger">{errors.sport}</div>}

              <Select
                placeholder={"Categories"}
                options={formattedOptions}
                isMulti // Enables multi-select
                onChange={handleCategoriesChange}
                className="mt-3"
              />
              {errors.categories && <div className="text-danger">{errors.categories}</div>}

              <Form.Control
                as="textarea"
                name="description"
                className="bg-transparent rounded-0 mt-3"
                placeholder="Product Description"
                style={{ height: "25vh" }}
                value={formData.description}
                onChange={updateFormField}
              />
              <div>
                <h6 className="mt-3">Image Upload</h6>
                <ImageUploader
                  images={images}
                  onImageUpload={handleImageUpload}
                />
              </div>

              <div className="d-grid mt-3">
                <Button
                  variant="dark"
                  className="rounded-0 py-2"
                  type="button"
                  onClick={createProduct}
                >
                  SUBMIT
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Container>
    </Fragment>
  );
}
