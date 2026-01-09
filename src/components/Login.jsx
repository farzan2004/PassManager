import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
    const navigate = useNavigate();

    const handleLoginSuccess = (credentialResponse) => {
        const decoded = jwtDecode(credentialResponse.credential);
        setUser(decoded);
        localStorage.setItem("user", JSON.stringify(decoded));

        navigate("/manager");
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <h1 className="text-2xl mb-4">Login to Your Password Manager</h1>
            <GoogleLogin onSuccess={handleLoginSuccess} onError={() => alert('Login Failed')} />
        </div>
    );
};

export default Login;
