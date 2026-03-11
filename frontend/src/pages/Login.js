import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Hospital } from '../components/Icons.js';
import '../styles/Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login logic here', formData);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <Hospital size={48} className="mx-auto mb-4" style={{color: '#4f46e5'}} />
                    <h1>HMS Elite</h1>
                    <p>Welcome back! Please login to your account.</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <Mail size={18} />
                            <input 
                                type="email" 
                                name="email"
                                placeholder="name@company.com" 
                                required 
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} />
                            <input 
                                type="password" 
                                name="password"
                                placeholder="••••••••" 
                                required 
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button type="submit" className="auth-button">
                        <div className="d-flex align-center justify-center">
                            <LogIn size={20} className="mr-2" />
                            Sign In
                        </div>
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/signup">Create one now</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
