import React from "react";
import './signInScreen.css'; 
import { FaUser } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa';
import { FaEnvelope  } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SignInScreen = () => {

    const[formValues,setFormValues] = React.useState({
        userEmail: '',
        userName: '',
        password: '',
    });
    const [showAlert, setShowAlert] = React.useState(false);
    const [emailError, setEmailError] = React.useState('');
    const [nameError, setNameError] = React.useState('');

    const handleInputChange=(e)=>{
        const {name,value} = e.target;
        setFormValues({...formValues,[name]:value});
        if (name === 'userEmail') {
            setShowAlert(false);
            setEmailError('');
        }
        if (name === 'userName') {
            setShowAlert(false);
            setNameError('');
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isEmailValid(formValues.userEmail)) {
            setEmailError('Invalid email format. Please use a valid ICT University email.');
            setShowAlert(true);
            return;
        }
        if (!isNameValid(formValues.userName)) {
            setNameError('Invalid name format. Please enter your name as in your ID.');
            setShowAlert(true);
            return;
        }
        
        // Valid email and password provided
        console.log('Form submitted successfully');
    };

    const isEmailValid = (email) => {
        return /^[a-zA-Z0-9._%+\-]+@ictuniversity\.edu\.cm$/.test(email);
    };

    const isNameValid = (name) => {
        return /^[a-zA-Z\s]+$/.test(name);
    };

    return (
        <div className="wrapper">
            <form onSubmit={handleSubmit}>
                
                <h1>Sign In</h1>

                <img 
                    src="/logo.png" 
                    alt="FiClear logo with stylized blue and green text, conveying a welcoming and professional tone"
                    className="logo"
                    style={{ width: '120px', height: 'auto' }} /* Slightly larger logo */
                />

                <div className="input-box">
                    <input type="email" 
                    placeholder="Your ICTU email" required
                    name="userEmail" 
                    value={formValues.userEmail}
                    onChange={handleInputChange}
                    pattern="[a-zA-Z0-9._%+\-]+@ictuniversity\.edu\.cm"
                    title="Please enter a valid ICT University email address (e.g., example@ictuniversity.edu.cm)" />
                    <FaEnvelope className="icon" />
                </div>

                <div className="input-box"> 
                    <input type="text" 
                    placeholder="Your name as in your ID" required 
                    name="userName"
                    value={formValues.userName}
                    onChange={handleInputChange}/>
                <FaUser className="icon" />
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
                    <input type="password" placeholder="Confirm your password" required />
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
                        {emailError || nameError}
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
