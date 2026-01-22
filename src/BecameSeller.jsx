import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaStore, FaShoppingCart, FaCheckCircle } from "react-icons/fa"; // Icons added
import Swal from "sweetalert2";
import "./App.css";

const SellerDashboard = () => {
  const navigate = useNavigate();

  const [shopDetails, setShopDetails] = useState({
    shopName: "",
    category: "Electronics",
    gstin: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!shopDetails.shopName) {
      return Swal.fire("Error", "Please enter shop name", "error");
    }
    
    Swal.fire("Success!", "Your seller account is being processed.", "success")
      .then(() => navigate("/"));
  };

  return (
    <div className="seller-bg">
      <div className="seller-form-card">
        
    
        <button className="close-seller-x" onClick={() => navigate("/")} title="Close and Go Home">
          <FaTimes />
        </button>

        <div className="seller-left">
          <div className="seller-icon-header">
            <FaStore size={50} />
          </div>
          <h2>Become a Seller</h2>
          <p>Register your shop on GaneshShop and reach millions of customers across India.</p>
          
          <ul className="seller-benefits">
            <li><FaCheckCircle className="check-icon" /> 0% Commission</li>
            <li><FaCheckCircle className="check-icon" /> Fast Payments</li>
            <li><FaCheckCircle className="check-icon" /> 24/7 Support</li>
          </ul>

          {/* Cart Shortcut in Seller Page */}
          <div className="mini-cart-status" onClick={() => navigate("/cart")}>
             <FaShoppingCart /> <span>Check Your Cart</span>
          </div>
        </div>
        
        <div className="seller-right">
           <form onSubmit={handleSubmit}>
              <h3 className="form-title">Enter Your Business Details</h3>
              
              <div className="s-input">
                 <label>Shop Name *</label>
                 <input 
                   type="text" 
                   placeholder="e.g. Ganesh Electronics" 
                   required
                   value={shopDetails.shopName}
                   onChange={(e) => setShopDetails({...shopDetails, shopName: e.target.value})}
                 />
              </div>

              <div className="s-input">
                 <label>Business Category</label>
                 <select 
                   value={shopDetails.category}
                   onChange={(e) => setShopDetails({...shopDetails, category: e.target.value})}
                 >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home Decor">Home Decor</option>
                    <option value="Grocery">Grocery</option>
                 </select>
              </div>

              <div className="s-input">
                 <label>GSTIN (Optional)</label>
                 <input 
                   type="text" 
                   placeholder="Enter GST number" 
                   value={shopDetails.gstin}
                   onChange={(e) => setShopDetails({...shopDetails, gstin: e.target.value})}
                 />
              </div>

              <div className="seller-terms">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">I agree to the terms and conditions.</label>
              </div>

              <button type="submit" className="list-btn">START SELLING NOW</button>
           </form>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;