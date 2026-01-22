import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic") || "https://cdn-icons-png.flaticon.com/512/149/149071.png");
  
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    house: "",
    city: "",
    pincode: ""
  });

  useEffect(() => {
    const savedAddress = JSON.parse(localStorage.getItem("userAddress"));
    if (savedAddress) setAddress(savedAddress);
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        localStorage.setItem("profilePic", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("userAddress", JSON.stringify(address));
    Swal.fire({
      title: "Profile Updated!",
      icon: "success",
      timer: 1500,
      showConfirmButton: false
    }).then(() => navigate("/"));
  };

  return (
    <div className="profile-container-vertical">
      <div className="profile-sidebar">
        <div className="avatar-section">
          <img src={profilePic} alt="Profile" className="profile-img-large" />
          <label htmlFor="photo-upload" className="upload-label">Change Photo</label>
          <input type="file" id="photo-upload" onChange={handlePhotoChange} style={{display: 'none'}} />
        </div>
        <div className="user-basic-info">
          <h3>{user.name || "User Name"}</h3>
          <p>{user.email || "user@example.com"}</p>
        </div>
      </div>

      <div className="profile-main-form">
        <h2>Personal & Delivery Details</h2>
        <form onSubmit={handleSave} className="vertical-form">
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" value={address.name} onChange={(e) => setAddress({...address, name: e.target.value})} required />
          </div>
          
          <div className="input-group">
            <label>Mobile Number</label>
            <input type="text" value={address.phone} onChange={(e) => setAddress({...address, phone: e.target.value})} required />
          </div>

          <div className="input-group">
            <label>Address (House/Street)</label>
            <textarea value={address.house} onChange={(e) => setAddress({...address, house: e.target.value})} required />
          </div>

          <div className="input-group">
            <label>City</label>
            <input type="text" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} required />
          </div>

          <div className="input-group">
            <label>Pincode</label>
            <input type="text" value={address.pincode} onChange={(e) => setAddress({...address, pincode: e.target.value})} required />
          </div>

          <button type="submit" className="save-btn-vertical">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;