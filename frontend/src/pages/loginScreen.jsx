import React from "react";
import './loginScreen.css'; 
import axios from 'axios';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';

const LoginScreen = () => {
    const navigate = useNavigate();
    const [formValues, setFormValues] = React.useState({
        userEmail: '',
        password: '',
    });
    const [showAlert, setShowAlert] = React.useState(false);
    const [emailError, setEmailError] = React.useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Trim all inputs except passwords
        const trimmedValue = name === 'password' ? value : value.trim();
        setFormValues({ ...formValues, [name]: trimmedValue });
        // Reset alert and error on input change to avoid showing stale errors
        setShowAlert(false);
        setEmailError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isEmailValid(formValues.userEmail)) {
            setEmailError('Invalid email format. Please use a valid ICT University email.');
            setShowAlert(true);
            return;
        }
        
        if (formValues.password.length === 0) {
            setEmailError('Please enter a password.');
            setShowAlert(true);
            return;
        }
        
        // Valid email and password provided
        console.log('Form submitted successfully');
        try{
            const response=await axios.post("http://localhost:5000/api/auth/login-user",{
                userEmail: formValues.userEmail,
                password: formValues.password
            });
            if (response.data.success){
                toast.success(response.data.message || "Login Successful")
                navigate('/Home');
            }else{
                toast.error(response.data.message || "Login Failed")
            }
        }catch(error){
            console.log("error",error.response.data);
            toast.error(error.response.data.message || "Something went wrong");
        }
            
    };

    const isEmailValid = (email) => {
        return /^[a-zA-Z0-9._%+]+@ictuniversity\.edu\.cm$/.test(email);
    };

    return (
        <div className="login-wrapper">
            <form onSubmit={handleSubmit}>
                {showAlert && (
                    <div className="error-alert">
                        {emailError}
                    </div>
                )}
                <h1>Login</h1>
                <img 
                    src="/logo.png" 
                    alt="FiClear logo with stylized blue and green text, conveying a welcoming and professional tone"
                    className="logo"
                    style={{ width: '120px', height: 'auto' }}
                />
                <div className="input-box">
                    <input
                        type="email"
                        placeholder="Your ICTU email"
                        required
                        name="userEmail"
                        value={formValues.userEmail}
                        onChange={handleInputChange}
                        pattern="[a-zA-Z0-9._%+\-]+@ictuniversity\.edu\.cm"
                        title="Please enter a valid ICT University email address (e.g., example@ictuniversity.edu.cm)"
                    />
                    <FaEnvelope className="icon" />
                </div>
                <div className="input-box"> 
                    <input type="password" placeholder="Your ICTU password" required name="password" value={formValues.password} onChange={handleInputChange} />
                    <FaLock className="icon" />
                </div>
                <div className="remember-forgot">
                    <label><input type="checkbox" />Remember me</label>
                </div>
                <button type="submit" className="btn">Login</button>
                <div className="register-link">
                    <p>Or <Link to="/signIn">Register</Link></p>
                </div>   
            </form>
        </div>
    );
};

export default LoginScreen;