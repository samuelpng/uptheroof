import { Fragment, useContext, useState } from "react";
import CustomerContext from "../../contexts/CustomerContext";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, FormSelect } from "react-bootstrap";
import { supabase } from "../../supabaseClient";
import { useEffect } from "react";
import React from "react";
import ReactCrop from "react-image-crop";
import Select from "react-select";
import ImageUploader from "../../components/ImageUploader";

export default function AdminCreate() {
  const context = useContext(CustomerContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    sport: 0,
    categories: [],
    image_url: "",
    description: ""
  });
  const [sports, setSports] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([])

  useEffect(() => {
    fetchSports();
    fetchCategories();
  }, []);

  const updateFormField = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchSports = async () => {
    // const {
    //   data: { user },
    // } = await supabase.auth.getUser();

    // if (user) {
    //   const { data, error } = await supabase
    //     .from("users")
    //     .select("*")
    //     .eq("auth_id", user.id)
    //     .single();

    //   if (error) console.error("Error fetching user:", error.message);
    //   else console.log("User profile:", data);
    // }
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

//   const addProduct = async () => {
//     // let form = formData.sport;

//     // Insert sport details into `sports` table
//     const { data, error } = await supabase
//       .from("sports")
//       .insert([
//         {
//           name: formData.name,
//           description: formData.description,
//           sport_id: formData.sport,
//           image_url: uploadedImages[0],
//           image_url2: uploadedImages[1],
//           image_url3: uploadedImages[2]
//         },
//       ])
//       .select();

//     if (error) console.error("Error inserting sport:", error.message);
//     else console.log("Sport added:", data[0].sport_name);
//   };

  const formattedOptions = categories.map((opt) => ({
    value: opt.id,
    label: opt.category_name,
  }));

  const handleCategoriesChange = (selected) => {
    setSelectedCategories(selected);
  };

  const createProduct = async () => {

    //upload images to supabase
    uploadToSupabase();

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name: formData.name,
          sport_id: formData.sport,
          description: formData.description,
          image_url: uploadedImages[0],
          image_url2: uploadedImages[1],
          image_url3: uploadedImages[2]
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

    // Now, insert categories
    const categories = selectedCategories; // Assuming this is an array of category IDs

    const categoryInserts = categories.map((categoryId) => ({
      product_id: productId,
      category_id: categoryId,
    }));

    const { data: data2, error: error2 } = await supabase
      .from("products_categories")
      .insert(categoryInserts);

    if (error2) {
      console.error("Error inserting categories:", error2);
    } else {
      console.log("Successfully inserted categories:", data2);
    }
  };

  // Upload multiple images to Supabase
  const uploadToSupabase = async () => {
    if (images.length === 0) return alert("No files selected!");

    setUploading(true);
    const uploadedUrls = [];

    for (const item of images) {
      const file = item.file;
      const fileName = `uploads/${Date.now()}_${file.name}`;

      const { data, error } = await supabase.storage
        .from("EJsports") // Replace with your Supabase bucket name
        .upload(fileName, file);

      if (error) {
        alert("Upload failed: " + error.message);
        setUploading(false);
        return;
      }

      // Get public URL
      const { data: publicUrl } = supabase.storage.from("EJsports").getPublicUrl(fileName);
      uploadedUrls.push(publicUrl.publicUrl);
    }

    setUploadedImages(uploadedUrls);
    setUploading(false);
  };

  const handleImageUpload = (newImages) => {
    setImages(newImages);
  };


  const handleUpload = (file) => {
    console.log("Selected file:", file);
    // Upload to Supabase or process the image
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
                className="form-input bg-transparent rounded-0 mb-3"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={updateFormField}
              />
              <Form.Select
                type="select"
                name="sport"
                className="form-input bg-transparent rounded-0 mb-3"
                placeholder="Sport"
                value={formData.sport}
                onChange={updateFormField}
              >
                {/* <option value="">Select a sport</option> */}
                {sports.map((s, index) => (
                  <option key={index} value={s.id}>
                    {s.sport_name}
                  </option>
                ))}
              </Form.Select>

              <Select
                placeholder={"Categories"}
                options={formattedOptions}
                isMulti // Enables multi-select
                onChange={handleCategoriesChange}
                className="mb-3"
              />

              <Form.Control
                type="text"
                name="contact"
                className="form-input bg-transparent rounded-0 mb-3"
                placeholder="Contact Number"
                value={formData.contact}
                onChange={updateFormField}
              />
              <Form.Control
                as="textarea"
                name="description"
                className="bg-transparent rounded-0 mb-3"
                placeholder="Product Description"
                style={{ height: "25vh" }}
                value={formData.description}
                onChange={updateFormField}
              />

              {/* <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              /> */}

              {/* <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {src && (
                <ReactCrop
                src={src}
                crop={crop}
                onChange={(newCrop) => setCrop(newCrop)}
                locked // Prevents users from changing the aspect ratio
                />
            )}
            </div>
             */}
              <div>
      <h6 className="mt-3">Image Upload</h6>
      <ImageUploader images={images} onImageUpload={handleImageUpload} />

      {/* <h2>Uploaded Images:</h2>
      <div style={{ display: "flex", gap: "10px" }}>
        {images.map((image, index) => (
          <img key={index} src={image.preview} alt={`Uploaded ${index}`} style={{ width: 100, borderRadius: 5 }} />
        ))}
      </div> */}
    </div>

              <div className="d-grid mt-4">
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
            {/* <p class="text-center">Don't have an account? <a href="/register">Register here</a></p> */}
          </div>
        </div>
      </Container>
    </Fragment>
  );
}
