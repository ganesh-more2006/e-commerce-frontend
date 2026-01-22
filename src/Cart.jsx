import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem("ganeshCart");
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  const removeItem = (index) => {
    const updated = cartItems.filter((_, i) => i !== index);
    setCartItems(updated);
    localStorage.setItem("ganeshCart", JSON.stringify(updated));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + parseInt(item.price.replace(/,/g, "")), 0);
  const delivery = subtotal > 500 ? 0 : 40;
  const total = subtotal + delivery;

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png" alt="Empty" />
        <h3>Your cart is empty!</h3>
        <p>Add items to it now.</p>
        <button onClick={() => navigate("/")}>Shop Now</button>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper">
      <div className="cart-main-content">
       
        <div className="cart-left-section">
          <div className="cart-header-card">
              <span>Deliver to: <b>Ganesh, 440001</b></span>
              <button className="change-addr">Change</button>
          </div>

          {cartItems.map((item, index) => (
            <div key={index} className="cart-product-card">
              <div className="product-img-box">
                <img src={item.img || "https://via.placeholder.com/150"} alt={item.name} />
              </div>
              <div className="product-info-box">
                <h4 className="p-title">{item.name}</h4>
                <p className="p-seller">Seller: GaneshShop</p>
                <div className="p-pricing">
                  <span className="p-current">₹{item.price}</span>
                  <span className="p-old">₹{item.old}</span>
                  <span className="p-off">OFF Available</span>
                </div>
                <button className="p-remove-btn" onClick={() => removeItem(index)}>REMOVE</button>
              </div>
            </div>
          ))}
          
          <div className="place-order-footer">
             <button className="place-btn" onClick={() => navigate("/payment")}>PLACE ORDER</button>
          </div>
        </div>

        
        <div className="cart-right-section">
          <div className="price-details-card">
            <h4 className="price-title">PRICE DETAILS</h4>
            <div className="price-line">
              <span>Price ({cartItems.length} items)</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="price-line">
              <span>Delivery Charges</span>
              <span className={delivery === 0 ? "free-text" : ""}>
                {delivery === 0 ? "FREE" : `₹${delivery}`}
              </span>
            </div>
            <div className="total-amount-line">
              <span>Total Amount</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <p className="save-msg">You will save ₹{(total * 0.1).toFixed(0)} on this order</p>
          </div>
          
          <div className="safe-pay-msg">
            <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/shield_b33c4c.svg" alt="" />
            <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;