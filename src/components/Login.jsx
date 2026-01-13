import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import eye from "../../public/icons/eye.png";
import eyecross from "../../public/icons/eyecross.png";

const Login = ({ setUser, setIsAuth }) => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [signup, setSignup] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");

    // -------- EMAIL / PASSWORD SIGNUP --------
    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (password != confirmPassword) {
            toast.error("password doesnt match!!", {
                position: "top-right",
                autoClose: 2500,
                theme: "colored",
            })
            setLoading(false);
            return;
        }
        try {
            const res = await fetch("http://localhost:5000/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    provider: "local",
                    name: email.split("@")[0], // simple name fallback
                    email,
                    password,
                }),
            });

            if (!res.ok) {
                toast.error("Signup failed. User may already exist.");
                throw new Error("Signup failed");
            }
            const data = await res.json();
            setUser({
                _id: data.userId,
                name: data.name,
                email: data.email,
            });
            setIsAuth(true);
            navigate("/manager");
        } catch (err) {
            console.error(err);
            // toast.error("Something went wrong!! Try again after some time.");
        } finally {
            setLoading(false);
        }
    };


    // -------- GOOGLE LOGIN --------
    const handleLoginGoogle = async (credentialResponse) => {
        try {
            const res = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    provider: "google",
                    token: credentialResponse.credential,
                }),
            });

            if (!res.ok) throw new Error("Google login failed");

            const me = await fetch("http://localhost:5000/auth/me", {
                credentials: "include",
            });

            if (!me.ok) throw new Error("Auth check failed");

            const data = await me.json();
            setUser(data.user);
            setIsAuth(true);
            toast.success("Login successfull..");
            navigate("/manager");
        } catch (err) {
            console.error(err);
            // toast.error("login failed!! Try again after some time.");
        }
    };
    // -------- EMAIL / PASSWORD LOGIN --------
    const handleLoginLocal = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    provider: "local",
                    email,
                    password,
                }),
            });

            if (!res.ok) {
                toast.error("invalied Email Id or password!!");
                throw new Error("Login failed");
            }

            const me = await fetch("http://localhost:5000/auth/me", {
                credentials: "include",
            });

            if (me.ok) {
                const data = await me.json();
                setUser(data.user);
                setIsAuth(true);
                toast.success("Login successfull..");
                navigate("/manager");
            }
        } catch (err) {
            console.error(err);
            // toast.error("Login failed!! Try again after some time.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]">
            <ToastContainer
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="colored"
            />
            <div className="rounded-full h-[30rem] w-[30rem] flex flex-col gap-2 justify-center items-center bg-purple-200 relative">
                <h1 className="text-2xl font-bold text-center">
                    Login to Password Manager
                </h1>

                {/* EMAIL LOGIN */}
                <form onSubmit={handleLoginLocal} className="flex flex-col gap-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className="p-2 rounded-[2.25rem] border text-black"
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="p-2 rounded-[2.25rem] border w-full text-black"
                        />
                        <img
                            src={showPassword ? eyecross : eye}
                            alt="toggle"
                            className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                            onClick={() => setShowPassword((prev) => !prev)}
                        />
                    </div>
                    {signup && (
                        <>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm Password"
                                    required
                                    className="p-2 rounded-[2.25rem] border w-full text-black"
                                />
                                <img
                                    src={showPassword ? eyecross : eye}
                                    alt="toggle"
                                    className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                />
                            </div>
                        </>
                    )}

                    {signup ? (
                        <>
                            <button
                                type="button"
                                onClick={handleSignup}
                                disabled={loading}
                                className="bg-green-500 text-black rounded-[2.25rem] p-2 font-semibold hover:bg-green-600 disabled:opacity-60"
                            >
                                {loading ? "signing up..." : "Signup"}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-green-500 text-black rounded-[2.25rem] p-2 font-semibold hover:bg-green-600 disabled:opacity-60"
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </>
                    )}
                    <button
                        type="button"
                        className="text-sm text-blue-700 font-semibold hover:underline mt-1"
                        onClick={() => setSignup(prev => !prev)}
                    >
                        {signup
                            ? "Already have an account? Login"
                            : "New user? Create an account"}
                    </button>

                </form>

                {/* DIVIDER */}
                <div className="text-center text-gray-600 font-semibold">OR</div>

                {/* GOOGLE LOGIN */}
                <GoogleLogin onSuccess={handleLoginGoogle} />
            </div>
        </div>

    );
};

export default Login;
