import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sport, setSport] = useState("");
  const [categories, setCategories] = useState([]);
  const [sports, setSports] = useState([]);

  const navigate = useNavigate()

  // Fetch products based on search & filters
  const fetchProducts = async () => {
    let query = supabase.from("products").select("*");

    if (search) {
      query = query.ilike("name", `%${search}%`); // Case-insensitive search
    }
   
    //togo: add categories
    if (category){ 
      query = query.eq("products_categories.category_id", category);
    }

    console.log('sport', sport)
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

  // const fetchProducts = async () => {
  //   let query = supabase
  //     .from("products")
  //     .select(`
  //       id, name, price, 
  //       sports(id, name), 
  //       products_categories(category_id, categories(id, name))
  //     `)
  //     .leftJoin("sports", "products.sport_id", "sports.id")
  //     .leftJoin("products_categories", "products.id", "products_categories.product_id")
  //     .leftJoin("categories", "products_categories.category_id", "categories.id");
  
  //   if (search) query = query.ilike("products.name", `%${search}%`);
  //   if (category) query = query.eq("categories.id", category);
  //   if (sport) query = query.eq("sports.id", sport);
  
  //   const { data, error } = await query;
  //   if (error) {
  //     console.error("Error fetching products:", error);
  //   } else {
  //     console.log("Fetched products:", data);
  //     setProducts(data);
  //   }
  // };
  
  

  // Fetch categories & sports for dropdowns
  const fetchFilters = async () => {
    const { data: categories } = await supabase.from("categories").select("*");
    // const { data, error } = await supabase.from("categories").select("*");

    const { data: sports } = await supabase.from("sports").select("*");
    console.log(categories)
    console.log(sports)
    setCategories(categories || []);
    setSports(sports || []);
  };

  useEffect(() => {
    fetchProducts();
    fetchFilters();
  }, [search, category, sport]); // Re-fetch when filters change

  const handleEdit = (product) => {
    console.log("Edit product:", product);
  };

  const handleDelete = async (productId) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);
    if (!error) fetchProducts(); // Refresh list after deletion
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
            <option key={c.id} value={c.name}>
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
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.sport_id}</td>
                <td>${product.price}</td>
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
