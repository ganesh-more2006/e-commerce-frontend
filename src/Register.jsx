import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css'; 

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://e-commerce-backend-black-psi.vercel.app/api/users/register', { name, email, password });
            alert('Registration Successful! Login now.');
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.message || 'Registration Failed');
        }
    };

    return (
        <div className="reg-wrapper">
            <div className="reg-card">
                <div className="reg-header">
                    <h2>Join GaneshShop</h2>
                    <p>Create an account to start shopping</p>
                </div>
                
                <form className="reg-form" onSubmit={submitHandler}>
                    <div className="reg-input-group">
                        <label>Full Name</label>
                        <input type="text" placeholder="Ganesh Kumar" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="reg-input-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="reg-input-group password-field">
                        <label>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Min 6 characters" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                style={{ width: '100%' }}
                            />
                            <span className="toggle-password-reg" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? "Hide" : "Show"}
                            </span>
                        </div>
                    </div>
                    <button type="submit" className="reg-submit-btn">Create Account</button>
                </form>
                <div className="reg-footer">
                    <p>Already have an account? <Link to="/login">Login Now</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;