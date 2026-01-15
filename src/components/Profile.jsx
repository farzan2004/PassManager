import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";

const Profile = ({ user, setIsAuth }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const confirm = await Swal.fire({
            title: "Logging Out",
            text: "Are you sure you want to log out?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Logout",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#9ca3af",
            background: "#e2d8fc",
        });

        if (!confirm.isConfirmed) return;

        await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });
        googleLogout();
        setIsAuth(false);
        navigate("/login");
    };

    return (
        // <div className='flex justify-center flex-col items-center align-middle [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] w-full'>
        <div className="relative min-h-screen flex justify-center items-center">
            <ToastContainer
                    position="top-right"
                    autoClose={2500}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    pauseOnHover
                    theme="colored"
                />
                <div className="absolute inset-0 -z-10 h-full w-full bg-purple-500 bg-[radial-gradient(circle_at_top,#fff_20%,#63e_90%)]"></div>
            <div className='rounded-full md:h-[27rem] md:w-[27rem] h-[21rem] w-[21rem] flex flex-col gap-2 justify-center items-center bg-purple-200 text-center'>
                <h2 className="text-xl font-bold">{user?.name}</h2>
                <p className="text-gray-600 font-semibold">{user?.email}</p>

                <button
                    onClick={handleLogout}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Profile;
