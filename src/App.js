import { Fragment } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

//=== Components ===
import NavBar from "./components/NavBar";

//=== Pages ===
import LandingPage from "./pages/LandingPage";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductsListing from "./pages/ProductsListing";
import Profile from "./pages/Profile";
import Stripe from "./components/Stripe";
// === Providers ===
import ProductsProvider from "./providers/ProductsProvider";
import CustomerProvider from "./providers/CutomerProvider";
import Orders from "./pages/Orders";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import AdminCreate from "./pages/admin/AdminCreateProduct";
import AdminAddSport from "./pages/admin/AdminAddSport";
import AdminAddCategories from "./pages/admin/AdminAddCategories";
import AdminList from "./pages/admin/AdminProductList";
import AdminEditProduct from "./pages/admin/AdminEditProduct";
import { AuthProvider } from "./contexts/AuthContext";
import { SportsProvider } from "./contexts/SportsContext";
import { CategoriesProvider } from "./contexts/CategoriesContext";
import ProductPage from "./pages/ProductPage";
import Portfolio from "./pages/Portfolio";
import Footer from "./components/Footer";
import Napfa from "./pages/napfa";
import AdminRoute from "./components/AdminRoutes";
import AdminLogin from "./pages/admin/AdminLogin";

function App() {
  return (
    <Fragment>
      <Router>
        <CustomerProvider>
          <ProductsProvider>
            <SportsProvider>
              <CategoriesProvider>
                <AuthProvider>
                  <div className="page-container">
                    <div className="content pb-3">
                      <NavBar />

                      <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route
                          path="/shop"
                          element={<ProductsListing />}
                        />
                        <Route
                          path="/shop/sports/:sportsId"
                          element={<ProductsListing />}
                        />
                        <Route
                          path="/shop/category/:categoryId"
                          element={<ProductsListing />}
                        />
                        <Route
                          path="/products/:productId"
                          element={<ProductPage />}
                        />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/about-us" element={<AboutUs />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/stripe" element={<Stripe />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/contact-us" element={<ContactUs />}/>
                        <Route path="portfolio" element={<Portfolio />} />
                        <Route path="/napfa" element={<Napfa />}/>
                        {/* <AuthProvider> */}
                        <Route path="/admin" element={<AdminRoute />}>
                          <Route path ="" element={<AdminLogin />} />
                          <Route path="create" element={<AdminCreate />} />
                          <Route path="create-sport" element={<AdminAddSport />} />
                          <Route path="create-categories" element={<AdminAddCategories />} />
                          <Route path="list" element={<AdminList />} />
                          <Route path="edit/:productId" element={<AdminEditProduct />} />
                        </Route>
                        {/* </AuthProvider> */}
                      </Routes>
                    </div>
                    <Footer />
                  </div>
                </AuthProvider>
              </CategoriesProvider>
            </SportsProvider>
          </ProductsProvider>
        </CustomerProvider>
      </Router>
    </Fragment>
  );
}

export default App;
