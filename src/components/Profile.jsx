import React from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

const Profile = ({ user, setUser }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        googleLogout();  // Logs out from Google
        setUser(null);    // Clears user state
        localStorage.removeItem("user"); // Removes user from storage
        navigate("/");    // Redirects to login page
    };

    return (
        <div className='flex justify-center flex-col items-center align-middle [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] w-full min-h-screen gap-5'>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>

            <button 
                onClick={handleLogout} 
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
                Logout
            </button>
        </div>
    );
};

export default Profile;
