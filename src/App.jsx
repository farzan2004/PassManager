import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Manager from './components/Manager';
import Contact from './components/Contact';
import Login from './components/Login';
import Profile from './components/Profile'; // Import Profile

function App() {
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
            credentials: "include",
        })
            .then(async res => {
                if (!res.ok) throw new Error("Not authenticated");
                const data = await res.json();
                setUser(data.user);
                setIsAuth(true);
            }).catch(() => {
                setUser(null);
                setIsAuth(false);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                {/* Login Page (only accessible if not logged in) */}
                <Route
                    path="/login" 
                    element={
                        !isAuth ? (
                            <Login setUser={setUser} setIsAuth={setIsAuth} />
                        ) : (
                            <Navigate to="/manager" />
                        )
                    }
                />
                <Route
                    path="/" 
                    element={
                        !isAuth ? (
                            <Login setUser={setUser} setIsAuth={setIsAuth} />
                        ) : (
                            <Navigate to="/manager" />
                        )
                    }
                />
                {/* Protected Routes */}
                <Route
                    path="/*"
                    element={
                        <ProtectedRoute
                            isAuth={isAuth}
                            user={user}
                            setUser={setUser}
                            setIsAuth={setIsAuth}
                        />
                    }
                />
            </Routes>
        </Router>
    );
}

const ProtectedRoute = ({ isAuth, user, setUser, setIsAuth }) => {
    if (!isAuth) return <Navigate to="/login" />;
    return (
        <>
            <Navbar user={user} setUser={setUser} />
            <div className='min-h-[90vh]'>
                <Routes>
                    <Route path="/manager" element={<Manager />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route
                        path="/profile"
                        element={<Profile user={user} setUser={setUser} setIsAuth={setIsAuth} />}
                    />
                </Routes>
            </div>
            <Footer />
        </>
    );
};

export default App;
