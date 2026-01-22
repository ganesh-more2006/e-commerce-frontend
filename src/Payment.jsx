import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import "./App.css";

const Payment = () => {
  const [step, setStep] = useState(1); 
  const navigate = useNavigate();

  const handlePayment = (e) => {
    e.preventDefault();
    setStep(2);
    setTimeout(() => setStep(3), 2000);
  };

  const saveOrderToHistory = () => {
    const cartItems = JSON.parse(localStorage.getItem("ganeshCart") || "[]");

    const totalAmount = cartItems.reduce((acc, item) => {
      const priceValue = parseInt(item.price.replace(/,/g, '').replace('₹', ''));
      return acc + (isNaN(priceValue) ? 0 : priceValue);
    }, 0);

    const newOrder = {
      items: cartItems,
      total: totalAmount.toLocaleString('en-IN'),
      date: new Date().toISOString(),
      orderId: "ORD" + Math.floor(Math.random() * 1000000)
    };
    const existingHistory = JSON.parse(localStorage.getItem("orderHistory") || "[]");
    localStorage.setItem("orderHistory", JSON.stringify([newOrder, ...existingHistory]));
    localStorage.removeItem("ganeshCart");
    console.log("Order saved to history successfully.");
  };

  const verifyOTP = () => {
    saveOrderToHistory();

    setStep(4);
    Swal.fire({
      title: 'Payment Verified!',
      text: 'Your order has been placed successfully.',
      icon: 'success',
      confirmButtonColor: '#2874f0'
    });
    setTimeout(() => navigate("/history"), 4000);
  };

  return (
    <div className="payment-page">
      {step === 1 && (
        <form className="payment-form" onSubmit={handlePayment}>
          <h3>Debit / Credit Card</h3>
          <div className="card-icons" style={{fontSize: '24px', marginBottom: '15px'}}>💳 🟦 🟧</div>
          <input type="text" placeholder="Card Number (16 Digits)" maxLength="16" required />
          <div className="flex-row" style={{display: 'flex', gap: '10px'}}>
            <input type="text" placeholder="MM/YY" maxLength="5" required style={{flex: 1}} />
            <input type="password" placeholder="CVV" maxLength="3" required style={{flex: 1}} />
          </div>
          <button type="submit" className="pay-btn">PAY NOW</button>
        </form>
      )}

      {step === 2 && (
        <div className="payment-status">
          <div className="loader"></div>
          <p>Processing your secure payment...</p>
        </div>
      )}

      {step === 3 && (
        <div className="payment-form">
          <h3>Secure OTP Verification</h3>
          <p style={{color: '#666'}}>Enter the 6-digit code sent to your mobile</p>
          <input type="text" placeholder="6-digit OTP" maxLength="6" id="otp" style={{textAlign: 'center', fontSize: '20px', letterSpacing: '5px'}} />
          <button onClick={verifyOTP} className="verify-btn">VERIFY & PLACE ORDER</button>
        </div>
      )}

      {step === 4 && (
        <div className="success-msg">
          <div className="check-icon-animate">✓</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for shopping with GaneshShop.</p>
          <p>Redirecting to your order history...</p>
        </div>
      )}
    </div>
  );
};

export default Payment;