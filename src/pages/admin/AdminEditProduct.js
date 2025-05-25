import { Fragment, useContext, useState } from "react";
import CustomerContext from "../../contexts/CustomerContext";
import "../../App.css";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Button, FormSelect } from "react-bootstrap";
import { supabase } from "../../supabaseClient";
import { useEffect } from "react";
import React from "react";
import Select from "react-select";
import ImageUploader from "../../components/ImageUploader";
import Swal from 'sweetalert2'

export default function AdminEditProduct() {
  const context = useContext(CustomerContext);
  const navigate = useNavigate();
  const { productId } = useParams();

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

  const [originalCategories, setOriginalCategories] = useState([])

  useEffect(() => {
    fetchSports();
    fetchCategories();
    fetchProduct();
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

  const fetchProduct = async () => {
    // const { data, error } = await supabase
    //   .from("products")
    //   .select('*, products_categories(category_id), categories(category_name)') // Fetch all fields that might be updated
    //   .eq("id", productId)
    //   .single();
    const { data, error } = await supabase
        .from('products')
        .select(`
            id,
            name,
            description,
            sport_id,
            products_categories!inner(categories!inner(id, category_name))!fk_category  
        `)
        .eq('id', productId)
        .single();
    

    if (error) {
      console.error("Error fetching product:", error);
      return;
    }

    setFormData({
        name: data.name,
        sport: data.sport_id,
        description: data.description,
      });
    
    //set selectedCategories
    // Transform the products_categories array
    const categories = data.products_categories.map(item => ({
        value: item.categories.id,
        label: item.categories.category_name,
    }));
    
    setOriginalCategories(categories)
    setSelectedCategories(categories)
    
  };

  
 
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
    // if (images.length === 0) errors.images = "Upload at least one image.";

    setErrors(errors);
    return Object.keys(errors).length === 0; // Returns true if no errors
  };


  const editProduct = async () => {
    validateForm()
    
    const { data, error } = await supabase
      .from("products")
      .update({
        name: formData.name,
        sport_id: formData.sport,
        description: formData.description ?? null,
      })
      .eq("id", productId);

    if (error) {
      console.error("Error updating product:", error);
      return;
    }

    // Insert categories
    const newCategories = selectedCategories;
    const oldCategories = originalCategories;
    console.log('new', newCategories)
    console.log('old', oldCategories)

    //compare old and new categories
    // Convert arrays to sets of category IDs for easier comparison
    const oldCategoryIds = oldCategories.map(c => c.value);
    const newCategoryIds = newCategories.map(c => c.value);

    // Get added category IDs 
    const addedCategoryIds = newCategoryIds.filter(id => !oldCategoryIds.includes(id));
    // Get deleted category IDs 
    const deletedCategoryIds = oldCategoryIds.filter(id => !newCategoryIds.includes(id));    

    // Insert added categories
    if (addedCategoryIds.length > 0) {
        console.log('adding')
        const categoryInserts = addedCategoryIds.map((id) => ({
            product_id: productId,
            category_id: id,
          }));
        console.log('inserts', categoryInserts)
        const { data: data2, error: error2 } = await supabase
            .from("products_categories")
            .insert(categoryInserts);

        if (error2) {
        console.error("Error inserting categories:", error2);
        } else {
        console.log("Successfully inserted categories:", data2);
        }
    }
    
    // Delete removed categories
    if (deletedCategoryIds.length > 0) {
        await supabase
        .from("products_categories")
        .delete()
        .in("category_id", deletedCategoryIds)
        .eq("product_id", productId);
    }

    Swal.fire({
      title: `${formData.name} successfully created`,
      icon: "success",
      confirmButtonText: "Back to Home screen",
    }).then(() => {
      navigate("/admin/list");
    });
    
      
      
    reset();
};

// Upload multiple images to Supabase
// const uploadToSupabase = async () => {
//     //if no images, do not have to upload
//     if (images.length === 0) {
//         return [];
//     }

//     setUploading(true);
//     const uploadedUrls = [];
    
//     for (const item of images) {
//         const file = item.file;
//         const fileName = `5sa3j8_1/${Date.now()}_${file.name}`;

//         const { data, error } = await supabase.storage
//             .from("EJsports") // Replace with your Supabase bucket name
//             .upload(fileName, file);

//         if (error) {
//             alert("Upload failed: " + error.message);
//             setUploading(false);
//             return [];
//         }

//         // Get public URL
//         const { data: publicUrl } = supabase.storage
//             .from("EJsports")
//             .getPublicUrl(fileName);

//         uploadedUrls.push(publicUrl.publicUrl);
//     }

//     setUploadedImages(uploadedUrls);
//     setUploading(false);

//     return uploadedUrls; // Return uploaded URLs
// };


//   const handleImageUpload = (newImages) => {
//     setImages(newImages);
//   };

  return (
    <Fragment>
      <Container>
        <div className="row mt-3">
          <div
            className="form mx-auto col-md-6 col-lg-5 mt-4 p-4 shadow-lg"
            style={{ border: "1px solid lightslategray" }}
          >
            <h1 className="text-center" style={{ fontFamily: "Righteous" }}>
              Edit Product
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
                value={selectedCategories}
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
              {/* <div>
                <h6 className="mt-3">Image Upload</h6>
                <ImageUploader
                  images={images}
                  onImageUpload={handleImageUpload}
                />
              </div> */}

              <div className="d-grid mt-3">
                <Button
                  variant="dark"
                  className="rounded-0 py-2"
                  type="button"
                  onClick={editProduct}
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
