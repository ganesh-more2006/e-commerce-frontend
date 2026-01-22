import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./App.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orderHistory") || "[]");
    setOrders(savedOrders);
  }, []);

  return (
    <div className="history-page-container">
      <div className="history-header">
        <h2>My Orders</h2>
        <p>View and track your previous purchases</p>
      </div>
      
      {orders.length === 0 ? (
        <div className="empty-history">
          <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png" alt="empty" />
          <h3>You have no orders</h3>
          <button className="shop-now-btn" onClick={() => navigate("/")}>START SHOPPING</button>
        </div>
      ) : (
        <div className="orders-wrapper">
          {orders.map((order, index) => (
            <div key={index} className="order-main-card">
              <div className="order-card-header">
                <span className="order-id-tag">Order ID: #{order.orderId || "ORD-00" + index}</span>
                <span className="order-date-tag">Placed on: {new Date(order.date).toLocaleDateString('en-GB')}</span>
              </div>
              
              <div className="order-items-list">
                {order.items.map((item, i) => (
                  <div key={i} className="single-item-row">
                    <div className="item-img-box">
                      <img src={item.img} alt={item.name} />
                    </div>
                    <div className="item-details-box">
                      <h4>{item.name}</h4>
                      <p className="item-category-text">Category: {item.category || "General"}</p>
                    </div>
                    <div className="item-price-status">
                      <p className="item-price-text">₹{item.price}</p>
                      <p className="delivery-status">
                        <span className="green-dot">●</span> Delivered
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-card-footer">
                <p>Order Total: <span className="final-amount">₹{order.total}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;