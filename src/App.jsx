import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import Swal from 'sweetalert2'; 
import { FaHome, FaUser, FaShoppingBag, FaSearch, FaHeart } from "react-icons/fa";
import { productsData, categoriesList } from "./productsData"; 
import "./App.css";
import Cart from "./Cart";
import Payment from "./Payment";
import Login from "./Login";
import Register from "./Register";
import SellerDashboard from "./BecameSeller"; 
import OrderHistory from "./OrderHistory";
import Profile from "./Profile";
import FooterInfoPage from "./FooterInfoPage";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [previewImg, setPreviewImg] = useState(""); 
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [sortType, setSortType] = useState("default");

  const banners = [
    "https://img.freepik.com/free-vector/horizontal-sale-banner-template_23-2148897328.jpg",
    "https://img.freepik.com/free-vector/flat-sale-banner-with-photo-template_23-2149026954.jpg",
    "https://img.freepik.com/free-vector/electronics-store-sale-banner_23-2148544445.jpg"
  ];

  const [currentBanner, setCurrentBanner] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); 

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAdmin = user && user.email === "krishna23@2006";
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const savedCart = localStorage.getItem("ganeshCart");
    if (savedCart) setCart(JSON.parse(savedCart));

    const sellerProducts = JSON.parse(localStorage.getItem("sellerProducts") || "[]");
    setAllProducts([...sellerProducts, ...productsData]);

    const bannerTimer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);

    const countdown = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(bannerTimer);
      clearInterval(countdown);
    };
  }, [banners.length]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length > 0) {
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (p) => {
    setSearchQuery(p.name);
    setSuggestions([]);
    setSelectedProduct(p);
    setPreviewImg(p.img);
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    Swal.fire("Logged Out", "Successfully logged out!", "success").then(() => {
      window.location.reload(); 
    });
  };

  const addToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem("ganeshCart", JSON.stringify(updatedCart));

    Swal.fire({ 
      title: 'Added!', 
      text: 'Product added to your cart successfully', 
      icon: 'success', 
      timer: 1500, 
      showConfirmButton: false, 
      toast: true, 
      position: 'top-end' 
    }).then(() => {
      setSelectedProduct(null); 
      navigate("/"); 
    });
  };

  const Home = () => {
    let filteredProducts = allProducts.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortType === "lowToHigh") {
      filteredProducts.sort((a, b) => parseFloat(a.price.replace(/,/g, '')) - parseFloat(b.price.replace(/,/g, '')));
    } else if (sortType === "highToLow") {
      filteredProducts.sort((a, b) => parseFloat(b.price.replace(/,/g, '')) - parseFloat(a.price.replace(/,/g, '')));
    }

    return (
      <div className="home-content-wrapper">
        <div className="categories-wrapper-new">
          <div className="categories-container-inner">
            <div className={`cat-item-new ${selectedCategory === "All" ? "cat-active" : ""}`} onClick={() => setSelectedCategory("All")}>
                <img src="https://imgs.search.brave.com/vWK1-2VeKFxI0x8e31g3HKSV3FvzRHuC-TMv8WE5QAg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/aWNvbnMtcG5nLmZy/ZWVwaWsuY29tLzI1/Ni81MTEwLzUxMTA3/ODUucG5nP3NlbXQ9/YWlzX3doaXRlX2xh/YmVs" alt="all" />
                <span>All</span>
            </div>
            {categoriesList.map((cat, i) => (
              <div key={i} className={`cat-item-new ${selectedCategory === cat.name ? "cat-active" : ""}`} onClick={() => setSelectedCategory(cat.name)}>
                <img src={cat.img} alt={cat.name} />
                <span>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {selectedCategory === "All" && (
          <div className="banner-premium-wrapper">
            <div className="banner-glass-slider">
              <img src={banners[currentBanner]} alt="Sale Banner" className="banner-img-main" />
              <div className="offer-badge-timer">
                 <div className="badge-pulse"></div>
                 <span className="timer-txt">SALE ENDS IN: <b>{formatTime(timeLeft)}</b></span>
              </div>
            </div>
          </div>
        )}

        <div className="modern-filter-bar">
          <div className="filter-left">
            <span className="filter-label">Sort by</span>
            <div className="filter-chips">
              <button className={sortType === "default" ? "chip-active" : ""} onClick={() => setSortType("default")}>Relevance</button>
              <button className={sortType === "lowToHigh" ? "chip-active" : ""} onClick={() => setSortType("lowToHigh")}>Price: Low to High</button>
              <button className={sortType === "highToLow" ? "chip-active" : ""} onClick={() => setSortType("highToLow")}>Price: High to Low</button>
            </div>
          </div>
        </div>

        <div className="product-section">
          <div className="product-grid-vertical">
            {filteredProducts.map((p) => (
              <div key={p.id} className="product-card-v" onClick={() => { setSelectedProduct(p); setPreviewImg(p.img); }}>
                {isAdmin && <span className="admin-tag">ADMIN VIEW</span>}
                <div className="img-box-v">
                  <img src={p.img} alt={p.name} />
                </div>
                <div className="p-info">
                  <p className="p-name">{p.name}</p>
                  <div className="p-price-row">
                    <p className="p-price">₹{p.price}</p>
                    <div className="ganesh-assured-badge">
                        <span className="g-logo">G</span>
                        <span className="g-text">Assured</span>
                    </div>
                  </div>
                  <button className="add-btn-small" onClick={(e) => { e.stopPropagation(); addToCart(p); }}>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedProduct && (
          <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
            <div className="modal-content premium-layout" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn-circle" onClick={() => setSelectedProduct(null)}>✕</button>
              <div className="modal-main-grid">
                <div className="modal-gallery-side">
                  <div className="main-display-box">
                    <img src={previewImg || selectedProduct.img} alt="Product" className="featured-img" />
                  </div>
                  <div className="thumbnail-track">
                    <img 
                      src={selectedProduct.img} 
                      className={previewImg === selectedProduct.img ? "thumb-active" : "thumb-normal"} 
                      onMouseEnter={() => setPreviewImg(selectedProduct.img)} 
                      alt="thumb" 
                    />
                    {selectedProduct.subImages && selectedProduct.subImages.map((s, idx) => (
                      <img 
                        key={idx} 
                        src={s} 
                        className={previewImg === s ? "thumb-active" : "thumb-normal"} 
                        onMouseEnter={() => setPreviewImg(s)} 
                        alt="thumb" 
                      />
                    ))}
                  </div>
                </div>
                <div className="modal-info-side">
                  <h1 className="product-main-title">{selectedProduct.name}</h1>
                  <p className="price-now">₹{selectedProduct.price}</p>
                  <div className="product-description-section">
                    <h3>About this item</h3>
                    <p>{selectedProduct.description || "High-quality premium item."}</p>
                  </div>
                  <div className="modal-cta-group">
                    <button className="btn-cart-premium" onClick={() => addToCart(selectedProduct)}>ADD TO CART</button>
                    <button className="btn-buy-premium" onClick={() => { setSelectedProduct(null); navigate("/cart"); }}>BUY NOW</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="app-container">
      <header className="navbar-fixed">
        <div className="nav-container">
          <div className="logo-section" onClick={() => navigate("/")}>
            <div className="ganesh-logo-main">
                <span className="brand-name-g">Ganesh</span>
                <span className="brand-sub-plus">Shop</span>
            </div>
          </div>
          
          {/* ✅ Fixed Search logic: Only on Home Page */}
          {isHomePage && (
            <div className="search-section desktop-search" style={{position: 'relative'}}>
              <input type="text" placeholder="Search for products, brands and more" value={searchQuery} onChange={handleSearchChange} />
              <button className="search-btn">🔍</button>
              {suggestions.length > 0 && (
                <div className="suggestions-box">
                  {suggestions.map((p) => (
                    <div key={p.id} className="suggestion-item" onClick={() => handleSuggestionClick(p)}>
                      <img src={p.img} alt={p.name} className="suggestion-img" />
                      <span className="suggestion-text">{p.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="nav-actions">
            {user ? (
              <div className="user-nav-dropdown">
                <span className="user-name">Hi, {user.name.split(' ')[0]} ▼</span>
                <div className="dropdown-links">
                   <Link to="/profile">Profile</Link>
                   <Link to="/history">Orders</Link>
                   {isAdmin && <Link to="/seller" style={{color: 'red'}}>Admin</Link>}
                   <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="login-link-new">Login</Link>
            )}
            <Link to="/cart" className="cart-link-nav hide-mobile">🛒 Cart ({cart.length})</Link>
          </div>
        </div>

        {isHomePage && (
          <div className="mobile-search-bar">
            <div className="m-search-box">
               <input type="text" placeholder="Search for products..." value={searchQuery} onChange={handleSearchChange} />
               <FaSearch className="m-search-icon" />
            </div>
          </div>
        )}
      </header>

      <main className="page-body">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/history" element={<OrderHistory />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/info/:type" element={<FooterInfoPage />} />
        </Routes>
      </main>

      {/* ✅ Home Icon at the first place in Bottom Nav */}
      <nav className="bottom-nav">
        <div className={`nav-item ${location.pathname === "/" ? "active" : ""}`} onClick={() => navigate("/")}>
          <FaHome />
          <span>Home</span>
        </div>
        <div className="nav-item">
          <FaHeart />
          <span>Wishlist</span>
        </div>
        <div className={`nav-item ${location.pathname === "/cart" ? "active" : ""}`} onClick={() => navigate("/cart")}>
          <FaShoppingBag />
          <span>Cart</span>
        </div>
        <div className={`nav-item ${location.pathname === "/login" || location.pathname === "/profile" ? "active" : ""}`} onClick={() => (user ? navigate("/profile") : navigate("/login"))}>
          <FaUser />
          <span>Account</span>
        </div>
      </nav>

      <footer className="footer-section">
        <div className="footer-inner">
          <div className="footer-col">
            <h4>ABOUT</h4>
            <Link to="/info/about">About Us</Link>
            <Link to="/info/contact">Contact Us</Link>
            <Link to="/info/careers">Careers</Link>
            <Link to="/info/stories">Ganesh Stories</Link>
          </div>
          <div className="footer-col">
            <h4>HELP</h4>
            <Link to="/info/payments">Payments</Link>
            <Link to="/info/shipping">Shipping</Link>
          </div>
          <div className="footer-col">
            <h4>SOCIAL</h4>
            <p>Facebook</p>
            <p>Instagram</p>
          </div>
          <div className="footer-col border-left">
            <h4>Mail Us:</h4>
            <p>GaneshShop Pvt Ltd,</p>
            <p>Nagpur, MH, India</p>
          </div>
        </div>
        <div className="footer-bottom">
           <span>© 2026 GaneshShop.com</span>
        </div>
      </footer>
    </div>
  );
}

export default App;