import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import Swal from 'sweetalert2'; 
import { FaHome, FaUser, FaShoppingBag, FaSearch, FaHeart, FaStore, FaChevronDown, FaEdit, FaTrash } from "react-icons/fa";
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
  // ✅ Fixed state for Dropdown toggle
  const [isDropOpen, setIsDropOpen] = useState(false);

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
      text: 'Product added successfully', 
      icon: 'success', 
      timer: 1000, 
      showConfirmButton: false, 
      toast: true, 
      position: 'top-end' 
    });
    
    // ✅ Redirect logic fixed: Always go to Home and close modal
    setSelectedProduct(null);
    if (location.pathname !== "/") navigate("/");
  };

  // ✅ Admin Edit/Delete Logic Added
  const handleDeleteProduct = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Product will be removed from list!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setAllProducts(prev => prev.filter(p => p.id !== id));
        Swal.fire('Deleted!', 'Product removed.', 'success');
      }
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
                <img src="https://cdn-icons-png.flaticon.com/512/5110/5110785.png" alt="all" />
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
          <div className="filter-chips">
            <button className={sortType === "default" ? "chip-active" : ""} onClick={() => setSortType("default")}>Relevance</button>
            <button className={sortType === "lowToHigh" ? "chip-active" : ""} onClick={() => setSortType("lowToHigh")}>Price: Low to High</button>
            <button className={sortType === "highToLow" ? "chip-active" : ""} onClick={() => setSortType("highToLow")}>Price: High to Low</button>
          </div>
        </div>

        <div className="product-section">
          <div className="product-grid-vertical">
            {filteredProducts.map((p) => (
              <div key={p.id} className="product-card-v" onClick={() => { setSelectedProduct(p); setPreviewImg(p.img); }}>
                {/* ✅ Admin Only Buttons on Card */}
                {isAdmin && (
                  <div className="admin-actions-overlay">
                    <button className="edit-icon-btn" onClick={(e) => { e.stopPropagation(); navigate("/seller"); }}><FaEdit /></button>
                    <button className="delete-icon-btn" onClick={(e) => { e.stopPropagation(); handleDeleteProduct(p.id); }}><FaTrash /></button>
                  </div>
                )}
                <div className="img-box-v hover-zoom">
                  <img src={p.img} alt={p.name} />
                </div>
                <div className="p-info">
                  <p className="p-name">{p.name}</p>
                  <div className="p-price-row">
                    <p className="p-price">₹{p.price}</p>
                    <button className="add-btn-small" onClick={(e) => { e.stopPropagation(); addToCart(p); }}>Add</button>
                  </div>
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
                    <img src={selectedProduct.img} className="thumb-item" onClick={() => setPreviewImg(selectedProduct.img)} alt="thumb" />
                    {selectedProduct.subImages && selectedProduct.subImages.map((s, idx) => (
                      <img key={idx} src={s} className="thumb-item" onClick={() => setPreviewImg(s)} alt="thumb" />
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
                  <div className="modal-cta-group stacked-mobile">
                    {/* ✅ Both buttons now trigger cart add and redirect with message */}
                    <button className="btn-cart-premium" onClick={() => addToCart(selectedProduct)}>ADD TO CART</button>
                    <button className="btn-buy-premium" onClick={() => { addToCart(selectedProduct); navigate("/cart"); }}>BUY NOW</button>
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
        <div className="nav-container mobile-nav-header">
          {isHomePage ? (
            <>
              <div className="search-section-mobile-left">
                <input type="text" placeholder="Search..." value={searchQuery} onChange={handleSearchChange} />
                <FaSearch className="m-search-icon-inside" />
                {suggestions.length > 0 && (
                  <div className="suggestions-box-mobile">
                    {suggestions.map((p) => (
                      <div key={p.id} className="suggestion-item" onClick={() => handleSuggestionClick(p)}>
                        <img src={p.img} className="sugg-img-mobile" alt="p" />
                        <span>{p.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="nav-actions-mobile-right">
                {user ? (
                  <div className="user-dropdown-container">
                    <button className="dropdown-trigger-btn" onClick={() => setIsDropOpen(!isDropOpen)}>
                      Hi, {user.name.split(' ')[0]} <FaChevronDown size={10} />
                    </button>
                    <div className={`dropdown-menu-list ${isDropOpen ? 'show-drop' : ''}`}>
                      <Link to="/profile" onClick={() => setIsDropOpen(false)}>Profile</Link>
                      <Link to="/history" onClick={() => setIsDropOpen(false)}>Orders</Link>
                      {isAdmin && <Link to="/seller" style={{color: 'red'}} onClick={() => setIsDropOpen(false)}>Admin</Link>}
                      <button onClick={handleLogout} className="logout-btn-drop">Logout</button>
                    </div>
                  </div>
                ) : (
                  <Link to="/login" className="login-link-white-mobile">Login</Link>
                )}
                <Link to="/cart" className="cart-link-white-mobile">🛒({cart.length})</Link>
              </div>
            </>
          ) : (
            <div className="page-header-simple" onClick={() => navigate("/")}>
               <span className="brand-logo-white">GaneshShop</span>
            </div>
          )}
        </div>
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

      <nav className="bottom-nav">
        <div className={`nav-item ${location.pathname === "/" ? "active" : ""}`} onClick={() => navigate("/")}><FaHome /><span>Home</span></div>
        <div className="nav-item" onClick={() => navigate("/seller")}><FaStore /><span>Seller</span></div>
        <div className={`nav-item ${location.pathname === "/cart" ? "active" : ""}`} onClick={() => navigate("/cart")}><FaShoppingBag /><span>Cart</span></div>
        <div className={`nav-item ${location.pathname === "/login" || location.pathname === "/profile" ? "active" : ""}`} onClick={() => (user ? navigate("/profile") : navigate("/login"))}><FaUser /><span>Account</span></div>
      </nav>

      <footer className="footer-section">
        <div className="footer-inner">
          <div className="footer-col">
            <h4 onClick={() => navigate("/seller")} style={{cursor: 'pointer', color: '#878787'}}>BECOME A SELLER</h4>
            <Link to="/info/about">About Us</Link>
            <Link to="/info/contact">Contact Us</Link>
            <Link to="/info/careers">Careers</Link>
            <Link to="/info/stories">Ganesh Stories</Link>
          </div>
          <div className="footer-col">
            <h4>HELP</h4>
            <Link to="/info/payments">Payments</Link>
            <Link to="/info/shipping">Shipping</Link>
            <Link to="/info/returns">Returns</Link>
            <Link to="/info/faq">FAQ</Link>
          </div>
          <div className="footer-col">
            <h4>POLICY</h4>
            <Link to="/info/return-policy">Return Policy</Link>
            <Link to="/info/terms">Terms Of Use</Link>
            <Link to="/info/security">Security</Link>
            <Link to="/info/privacy">Privacy</Link>
          </div>
          <div className="footer-col border-left">
            <h4>Mail Us:</h4>
            <p>GaneshShop Pvt Ltd, Nagpur</p>
          </div>
        </div>
        <div className="footer-bottom"><span>© 2026 GaneshShop.com</span></div>
      </footer>
    </div>
  );
}

export default App;