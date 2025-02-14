import { Fragment } from 'react'
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css"

//=== Components ===
import NavBar from "./components/NavBar"

//=== Pages ===
import LandingPage from './pages/LandingPage'
import Variants from './pages/Variants';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductsListing from './pages/ProductsListing';
import Profile from './pages/Profile';
import Stripe from './components/Stripe'
// === Providers ===
import ProductsProvider from './providers/ProductsProvider';
import CustomerProvider from './providers/CutomerProvider';
import Orders from './pages/Orders';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import AdminCreate from './pages/admin/AdminCreateProduct';
import AdminAddSport from './pages/admin/AdminAddSport';
import AdminAddCategories from './pages/admin/AdminAddCategories';
import AdminList from './pages/admin/AdminProductList';

function App() {
  return (
    <Fragment>

      <Router>
        <CustomerProvider>
          <ProductsProvider>
            <NavBar />

            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/shop/:brand_id" element={<ProductsListing />} />
              <Route path="/products/:productId" element={<Variants />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/stripe" element={<Stripe />} />
              <Route path="/orders" element={<Orders />} />

              <Route path = "/admin/*">
              {/* <Route path="dashboard" element={<Dashboard />} /> */}
              <Route path="create" element={<AdminCreate />} />
              <Route path="create-sport" element={<AdminAddSport />} />
              <Route path="create-categories" element={<AdminAddCategories />} />
              <Route path="list" element={<AdminList />} />
              {/* <Route path="orders" element={<Orders />} />
              <Route path="users" element={<Users />} /> */}
            </Route>

          </Routes>

          </ProductsProvider>
        </CustomerProvider>
      </Router>

    </Fragment>

  );
}

export default App;
