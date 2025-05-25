import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sport, setSport] = useState("");
  const [categories, setCategories] = useState([]);
  const [sports, setSports] = useState([]);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    let query = supabase.from("products").select(`
      id,
      name,
      description,
      image_url,
      sport_id,
      sports(sport_name),
      products_categories!inner(categories!inner(id, category_name))
    `);

    if (search) {
      query = query.ilike("name", `%${search}%`);
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

  const fetchFilters = async () => {
    const { data: categories } = await supabase.from("categories").select("*");
    const { data: sports } = await supabase.from("sports").select("*");

    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.category_name
    }));

    setCategories(formattedCategories || []);
    setSports(sports || []);
  };

  useEffect(() => {
    fetchProducts();
    fetchFilters();
  }, [search, category, sport]);

  const handleEdit = (product) => {
    navigate(`/admin/edit/${product.id}`);
  };

  const deleteProduct = async (id) => {
    const { error: categoryError } = await supabase
      .from('products_categories')
      .delete()
      .eq('product_id', id);

    if (categoryError) {
      console.error("Error deleting product categories:", categoryError.message);
      Swal.fire("Error", "Failed to delete product categories.", "error");
      return;
    }

    const { error: productError } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (productError) {
      console.error("Error deleting product:", productError.message);
      Swal.fire("Error", "Failed to delete product.", "error");
    } else {
      Swal.fire("Deleted!", "The product has been deleted.", "success");
      fetchProducts();
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
        deleteProduct(id);
      }
    });
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="text-center" style={{ fontFamily: "Righteous" }}>
          Manage Products
        </h1>
        <button className="btn btn-dark" onClick={() => navigate("/admin/create")}>
          <FaPlus /> Create New
        </button>
      </div>

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
          {sports.map((s, index) => (
            <option key={index} value={s.id}>
              {s.sport_name}
            </option>
          ))}
        </select>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Sport</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }}
                    />
                  ) : (
                    <span className="text-muted">No image</span>
                  )}
                </td>
                <td>{product.name}</td>
                <td>{product.products_categories.map(item => item.categories.category_name).join(", ")}</td>
                <td>{product.sports?.sport_name}</td>
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
