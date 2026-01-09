import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Manager from './components/Manager';
import Contact from './components/Contact';
import Login from './components/Login';
import Profile from './components/Profile'; // Import Profile

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false); // Ensure loading is false after checking user
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                {/* Login Page (only accessible if not logged in) */}
                <Route path="/" element={!user ? <Login setUser={setUser} /> : <Navigate to="/manager" />} />

                {/* Protected Routes */}
                <Route path="/*" element={<ProtectedRoute user={user} setUser={setUser} />} />
            </Routes>
        </Router>
    );
}

const ProtectedRoute = ({ user, setUser }) => {
    if (!user) return <Navigate to="/" />;
    return (
        <>
            <Navbar user={user} setUser={setUser} />
            <div className='min-h-[90vh]'>
                <Routes>
                    <Route path="/manager" element={<Manager />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/profile" element={<Profile user={user} setUser={setUser} />} /> 
                </Routes>
            </div>
            <Footer />
        </>
    );
};

export default App;
