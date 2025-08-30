import React from "react";
import './signInScreen.css'; 
import { FaUser } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa';
import { FaEnvelope  } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../apiConfig';

const SignInScreen = () => {
const navigate = useNavigate();

    const[formValues,setFormValues] = React.useState({
        userEmail: '',
        userName: '',
        password: '',
        confirmPassword: '',
        matricule:'',
    });
    const [showAlert, setShowAlert] = React.useState(false);
    const [emailError, setEmailError] = React.useState('');
    const [nameError, setNameError] = React.useState('');
    const [passwordError, setPasswordError] = React.useState('');

    const handleInputChange=async(e)=>{
        const {name,value} = e.target;
        // Trim inputs in real-time, but exclude passwords and userName to allow spaces
        let processedValue = (name === 'password' || name === 'confirmPassword' || name === 'userName') ? value : value.trim();
        
        // Apply matricule validation: only letters and numbers
        if (name === 'matricule') {
            processedValue = processedValue.replace(/[^a-zA-Z0-9]/g, '');
        }
        
        setFormValues({...formValues,[name]:processedValue});
        
        if (name === 'userEmail') {
            setShowAlert(false);
            setEmailError('');
        }
        if (name === 'userName') {
            setShowAlert(false);
            setNameError('');
        }
        if (name === 'password' || name === 'confirmPassword') {
            setShowAlert(false);
            setPasswordError('');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Reset all errors
        setEmailError('');
        setNameError('');
        setPasswordError('');
        
        if (!isEmailValid(formValues.userEmail)) {
            setEmailError('Invalid email format. Please use a valid ICT University email.');
            setShowAlert(true);
            return;
        }

        // Validate userName, trimming to catch inputs with only spaces
        if (!formValues.userName.trim()) {
            setNameError('Name is required.');
            setShowAlert(true);
            return; // Stop submission if name is invalid
        }
        
        if (formValues.password !== formValues.confirmPassword) {
            setPasswordError('Passwords do not match. Please check your password and confirmation.');
            setShowAlert(true);
            return;
        }
        if (formValues.password.length < 6) {
            setPasswordError('Password must be at least 6 characters long.');
            setShowAlert(true);
            return;
        }
        
        // Prepare data for server - only send password, not confirmPassword
        const serverData = {
            userEmail: formValues.userEmail.trim().toLowerCase(),
            userName: formValues.userName.trim(), // Trim userName just before sending
            password: formValues.password,
            matricule: formValues.matricule
        };
        
        try {
            const apiUrl = new URL('auth/register-user', API_URL).href;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(serverData),
            });

            // Always parse the response as JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server returned invalid response format');
            }

            const data = await response.json();
            
            if (data.success) {
                console.log('Registration successful:', data);
                // Store token and redirect
                localStorage.setItem("authToken", data.token);
                localStorage.setItem("keepLoggedIn", JSON.stringify(true));
                navigate('/Home');
            } else {
                console.error('Registration failed:', data.message);
                setPasswordError(data.message || 'Registration failed. Please try again.');
                setShowAlert(true);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            
            let errorMessage = 'An error occurred during registration.';
            
            if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
                errorMessage = 'Network error. Please check your internet connection and try again.';
            } else if (error.message.includes('invalid response format')) {
                errorMessage = 'Server returned an invalid response. Please contact support.';
            } else {
                errorMessage = error.message || 'Registration failed. Please try again.';
            }
            
            setPasswordError(errorMessage);
            setShowAlert(true);
        }
    };

    const isEmailValid = (email) => {
        return /^[a-zA-Z0-9._%+]+@ictuniversity\.edu\.cm$/.test(email);
    };
    
    return (
        <div className="wrapper">
            <form onSubmit={handleSubmit}>
                
                <h1>Sign In</h1>

                <img 
                    src="/logo.png" 
                    alt="FiClear logo with stylized blue and green text, conveying a welcoming and professional tone"
                    className="logo"
                    style={{ width: '120px', height: 'auto' }}
                />

                <div className="input-box">
                    <input type="email" 
                    placeholder="Your ICTU email" required
                    name="userEmail" 
                    value={formValues.userEmail}
                    onChange={handleInputChange}
                    pattern="[a-zA-Z0-9._%+]+@ictuniversity\.edu\.cm"
                    title="Please enter a valid ICT University email address (example@ictuniversity.edu.cm)" />
                    <FaEnvelope className="icon" />
                </div>

                <div className="input-box"> 
                    <input type="varchar" 
                    placeholder="Your name as in your ID" required 
                    name="userName"
                    value={formValues.userName}
                    onChange={handleInputChange}/>
                <FaUser className="icon" />
                </div>

                <div className="input-box">
                    <input type="varchar"
                    placeholder="Your Matricule (optional)"
                    name="matricule"
                    value={formValues.matricule}
                    onChange={handleInputChange}/>
                <FaUser className="icon"/>                
                </div>

                <div className="input-box"> 
                    <input type="password"
                    placeholder="Your ICTU password" required
                    name="password"
                    value={formValues.password}
                    onChange={handleInputChange}/>
                    <FaLock className="icon" />
                </div>

                <div className="input-box"> 
                    <input type="password" 
                    placeholder="Confirm your password" required
                    name="confirmPassword"
                    value={formValues.confirmPassword}
                    onChange={handleInputChange} />
                    <FaLock className="icon" />
                </div>
                
                {showAlert && (
                    <div style={{
                        backgroundColor: '#ff4444',
                        color: '#fff',
                        padding: '10px',
                        margin: '10px 0',
                        borderRadius: '4px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '16px'
                    }}>
                        {emailError || nameError || passwordError}
                    </div>
                )}

                <button type="submit" className="btn">Sign In</button>
                <div className="register-link">
                    <p>Or <Link to="/">Log in</Link></p>
                </div>   
            </form>
        </div>
    );
};

export default SignInScreen;
