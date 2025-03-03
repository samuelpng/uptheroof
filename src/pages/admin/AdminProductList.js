import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sport, setSport] = useState("");
  const [categories, setCategories] = useState([]);
  const [sports, setSports] = useState([]);

  const navigate = useNavigate()

  const fetchProducts = async () => {
    let query = supabase.from("products").select(`
      id,
      name,
      description,
      sport_id,
      sports(sport_name),
      products_categories!inner(categories!inner(id, category_name))
    `);
  
    if (search) {
      query = query.ilike("name", `%${search}%`); // Case-insensitive search
    }

    if (category) {
      query = query.eq("products_categories.category_id", category);
    }
  
    if (sport) {
      query = query.eq("sport_id", sport);
    }
  
    const { data, error } = await query;
    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data);
    }
  };
  
  
  

  // Fetch categories & sports for dropdowns
  const fetchFilters = async () => {
    const { data: categories } = await supabase.from("categories").select("*");

    const { data: sports } = await supabase.from("sports").select("*");
    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.category_name
    }))
    setCategories(formattedCategories || []);
    setSports(sports || []);
  };

  useEffect(() => {
    fetchProducts();
    fetchFilters();
  }, [search, category, sport]); // Re-fetch when filters change

  const handleEdit = (product) => {
    navigate(`/admin/edit/${product.id}`)
  };

  const deleteProduct = async (id) => {

    // First, delete related records from `products_categories`
    const { error: categoryError } = await supabase
        .from('products_categories')
        .delete()
        .eq('product_id', id); // Assuming 'product_id' is the foreign key

    if (categoryError) {
        console.error("Error deleting product categories:", categoryError.message);
        Swal.fire("Error", "Failed to delete product categories.", "error");
        return;
    }

    // Now, delete the product itself
    const { error: productError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (productError) {
        console.error("Error deleting product:", productError.message);
        Swal.fire("Error", "Failed to delete product.", "error");
    } else {
      Swal.fire("Deleted!", "The product has been deleted.", "success");
      fetchProducts()
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
        // delete on supabase
        deleteProduct(id)
  
        
      }
    });
  };
  


  return (
    <div className="container">
      {/* Header with Create Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="text-center" style={{ fontFamily: "Righteous" }}>
          Manage Products
        </h1>
        <button className="btn btn-dark" onClick={() => navigate("/admin/create")}>
          <FaPlus /> Create New
        </button>
      </div>
      {/* <h1 className="text-center" style={{ fontFamily: "Righteous" }}>
        Manage Products
      </h1> */}

      {/* Search & Filter Section */}
      <div className="d-flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Search products..."
          className="form-control"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="form-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className="form-select"
          value={sport}
          onChange={(e) => setSport(e.target.value)}
        >
          <option value="">All Sports</option>
          {/* {sports.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))} */}
          {sports.map((s, index) => (
                  <option key={index} value={s.id}>
                    {s.sport_name}
                  </option>
                ))}
        </select>
      </div>

      {/* Product Table */}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Sport</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.products_categories.map(item => item.categories.category_name).join(", ")}</td>
                <td>{product.sports.sport_name}</td>
                <td>{product.stock}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => handleEdit(product)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(product.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductList;
