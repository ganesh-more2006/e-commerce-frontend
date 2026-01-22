import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
const { data } = await axios.post('https://e-commerce-backend-black-psi.vercel.app/api/users/login', { email, password });
      
      localStorage.setItem('user', JSON.stringify(data));
      alert('Login Successful!');
      navigate("/");
      window.location.reload(); 
    } catch (error) {
      alert(error.response?.data?.message || 'Login Failed: Server not responding');
    }
  };

  return (
    <div className="login-container">
      <div className="bg-circle one"></div>
      <div className="bg-circle two"></div>

      <motion.div 
        className="login-box"
        initial={{ opacity: 0, y: 50, scale: 0.9 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }}  
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="login-left">
          <motion.h2
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.3 }}
          >Login</motion.h2>
          <p>Get access to your Orders, Wishlist and Recommendations</p>
          <motion.img 
            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" 
            alt="login" 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        <div className="login-right">
          <form onSubmit={submitHandler}>
            <div className="input-group">
              <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="input-group password-field">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit" 
              className="login-btn"
            >
              Login
            </motion.button>
          </form>
          
          <div className="login-footer">
            <Link to="/register" className="create-account">New to GaneshShop? Create an account</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;