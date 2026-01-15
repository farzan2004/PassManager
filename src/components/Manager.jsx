import React, { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";

const Manager = () => {
    const ref = useRef();
    const ref2 = useRef();
    const contref = useRef();
    const [form, setform] = useState({ site: "", username: "", password: "" });
    const [passArray, setpassArray] = useState([]);
    const [showOptions, setShowOptions] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");
    const optionsRef = useRef(null);

    const getpasswords = async (query = "") => {
        let req = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/passwords?search=${encodeURIComponent(query)}`,
            { credentials: "include" }
        );
        if (req.status === 401) {
            toast.info("Session expired. Please login again.", {
                position: "top-cemter",
            });
            return;
        }
        if (!req.ok) {
            toast.error("something went wrong!! We are working on it.");
            return;
        }
        const passwords = await req.json();
        setpassArray(passwords);
    };

    useEffect(() => {
        const contheight = contref.current.scrollHeight + 120;
        contref.current.style.height = `${contheight}px`
    }, [passArray])

    const handleSearch = () => {
        if (!search.trim()){
            toast.info("Empty Search!! Try searching a website name or a username.", {
                position: "top-center",
                autoClose: 2500,
            })
            setpassArray([]);
            return;
        } 
        getpasswords(search);
    };

    const showpass = () => {
        if (ref.current.src.includes("icons/eyecross.png")) {
            ref.current.src = "icons/eye.png";
            ref2.current.type = "password";
        } else {
            ref.current.src = "icons/eyecross.png";
            ref2.current.type = "text";
        }
    };

    const savepass = async () => {
        if (!form.password) {
            const confirm = await Swal.fire({
                title: "Empty Password field!!",
                text: "U sure want to proceed?.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Proceed",
                cancelButtonText: "Cancel",
                confirmButtonColor: "#1e763e",
                cancelButtonColor: "#9ca3af",

                background: "#e2d8fc", // 👈 modal background
            });

            if (!confirm.isConfirmed) return;
        }
        if (!form.site || !form.username) {
            toast.error('Please fill in all fields before saving.', {
                position: "top-right",
                autoClose: 2000,
                theme: "colored",
            });
            return;
        }

        if (editingId) {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/passwords/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
                credentials: "include",
            });

            if (!res.ok) {
                toast.error("Update failed!");
                return;
            }
            setpassArray(
                passArray.map(item =>
                    item._id === editingId ? { ...item, ...form } : item
                )
            );

            setEditingId(null);
        }

        // CREATE MODE → INSERT
        else {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/passwords`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
                credentials: "include",
            });
            if (!res.ok) {
                toast.error("Update failed!! Please try again after some time.");
                return;
            }
            const saved = await res.json(); // includes _id
            setpassArray([...passArray, { ...saved, password: form.password }]);
        }

        toast.success('Password saved.', {
            position: "top-right",
            autoClose: 1500,
            theme: "colored",
        });
        setform({ site: "", username: "", password: "" });
    };

    const handlechange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value });
    };

    const copytext = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard', {
            position: "bottom-right",
            autoClose: 1500,
            theme: "colored",
        });
    };

    const options = (index) => {
        setShowOptions(showOptions === index ? null : index);
    };

    const deletepass = async (_id) => {
        const confirm = await Swal.fire({
            title: "Delete password?",
            text: "Are u sure u wanna delete.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#9ca3af",

            background: "#e2d8fc", // 👈 modal background
        });

        if (!confirm.isConfirmed){
            setShowOptions(null);
            return;
        }

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/passwords/${_id}`, {
            method: "DELETE",
            credentials: "include",
        });
        if (!res.ok) {
            toast.error("Delete failed!! Please try again after some time.");
            return;
        }
        setpassArray(passArray.filter(item => item._id !== _id));
        toast.success('Password deleted.', {
            position: "top-right",
            autoClose: 1500,
            theme: "colored",
        });
        setShowOptions(null);
    };

    const editpass = (pass) => {
        setform({
            site: pass.site,
            username: pass.username,
            password: "",
        });
        toast.info("Editing password", {
            position: 'top-center',
            autoClose: 2500,
        });
        setEditingId(pass._id); // 🔑 tells savepass we are editing
        setShowOptions(null);
    };

    return (
        <div className='relative'>
            <ToastContainer
                position="bottom-right"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition:slide
            />
            <div className="absolute inset-0 -z-10 h-full w-full bg-purple-500 bg-[radial-gradient(circle_at_top,#fff_20%,#63e_90%)]"></div>


            <div ref={contref} className="mx-auto mb-3 rounded-3xl max-w-[80rem] bg-purple-100 min-h-[500px]">

                <h3 className='text-3xl font-bold text-center w-35'>
                    <span>PassMan</span>
                    <span className="text-green-800 font-bold">(&#183; _ &#183;)</span>
                </h3>
                <p className="text-green-800 text-lg text-center w-35 mt-2">Never forget a password again.</p>

                <div className="text-black flex flex-col p-3 gap-6">
                    <input value={form.site} onChange={handlechange} placeholder='Website URL' type="text" className="rounded-full border border-green-900 w-full px-4" name='site' />

                    <div className="flex flex-col md:flex-row gap-5">
                        <input value={form.username} onChange={handlechange} placeholder='Username or Email' type="text" className="rounded-full border border-green-900 w-full px-4" name='username' />

                        <div className="relative">
                            <input ref={ref2} value={form.password} onChange={handlechange} placeholder='Password' type="password" className="rounded-full border border-green-900 w-full px-4" name='password' />
                            <span className='absolute right-1 font-light hover:cursor-pointer' onClick={showpass}>
                                <img ref={ref} width={23} src="icons/eye.png" alt="show" />
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center w-35 justify-center">
                        <button onClick={savepass} className="group flex items-center justify-center bg-green-400 border-2 border-green-600 rounded-full m-2 p-2 text-black hover:bg-green-500 w-32">
                            <lord-icon
                                src="https://cdn.lordicon.com/slmechys.json"
                                trigger="loop-on-hover"
                                className="group-hover:trigger"
                                style={{ width: "30px", height: "30px" }}>
                            </lord-icon>
                            {editingId ? "Update" : "Save"}
                        </button>
                        {editingId && (
                            <button
                                className="group items-center bg-red-400 border-2 border-red-600 rounded-full m-2 p-2 text-black hover:bg-red-500 w-32"
                                onClick={() => {
                                    setEditingId(null);
                                    setform({ site: "", username: "", password: "" });
                                }}
                            >
                                Cancel edit
                            </button>
                        )}
                    </div>

                    <div className="max-w-6xl w-full px-3 flex flex-col justify-start">
                        <div className='flex md:flex-row flex-col md:gap-12 gap-1 my-3 justify-start items-center'>
                            <h2 className='font-semibold text-2xl py-3'>Credentials
                                {/* <span className="text-green-800 font-medium md:font-extrabold">&#128273;</span> */}
                            </h2>
                            <div className='flex justify-between items-center gap-2 rounded-full border border-green-900 bg-green-50 px-2 w-[16rem]'>
                                <input
                                    type="text" placeholder="Search by site or username" value={search}
                                    onChange={(e) => {
                                        const value = e.target.value; setSearch(value);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleSearch();
                                        }
                                    }}
                                    className="bg-transparent outline-none w-full md:text-sm text-xs placeholder:text-green-700"
                                />
                                <button onClick={handleSearch}
                                    className="text-green-700 text-base hover:scale-125 hover:opacity-100 opacity-90">🔍</button>
                            </div>
                        </div>
                        {passArray.length === 0 && <div>Nothing to show. Try searching for a saved password or saving one.</div>}

                        {passArray.length !== 0 &&
                            <div className="w-full overflow-x-auto">
                                <table className="table-auto w-full rounded-3xl min-w-[350px]">
                                    <thead className='bg-purple-400 rounded-xl text-black'>
                                        <tr>
                                            <th className='my-2 py-1'>Website URL</th>
                                            <th className='my-2 py-1'>Username or Email</th>
                                            <th className='my-2 py-1'>Password</th>
                                            <th className='my-2 py-1'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className='bg-purple-100 rounded-md overflow-hidden'>
                                        {passArray.map((item, index) => (
                                            <tr key={item._id}>
                                                <td className='text-center cursor-pointer flex items-center justify-center'>
                                                    <a href={item.site} target='_blank' rel='noopener noreferrer'>{item.site}</a>
                                                    <button className='copy' onClick={() => copytext(item.site)}>
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/depeqmsz.json"
                                                            trigger="hover"
                                                            style={{ width: "14px", height: "14px" }}>
                                                        </lord-icon>
                                                    </button>
                                                </td>


                                                <td className='text-center cursor-pointer'>
                                                    {item.username}
                                                    <button className='copy' onClick={() => copytext(item.username)}>
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/depeqmsz.json"
                                                            trigger="hover"
                                                            style={{ width: "14px", height: "14px" }}>
                                                        </lord-icon>
                                                    </button>
                                                </td>


                                                <td className='text-center cursor-pointer'>
                                                    {"*".repeat(item.password.length)}
                                                    <button className='copy' onClick={() => copytext(item.password)}>
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/depeqmsz.json"
                                                            trigger="hover"
                                                            style={{ width: "14px", height: "14px" }}>
                                                        </lord-icon>
                                                    </button>
                                                </td>


                                                <td className='text-center cursor-pointer' ref={optionsRef}>
                                                    <button className='w-8 h-4' onClick={() => options(index)}>
                                                        <img src="icons/option.svg" alt="options" />
                                                    </button>

                                                    {showOptions === index && (
                                                        <div className='absolute bg-slate-100 border rounded shadow-lg'>
                                                            <button className='block w-full text-left px-4 py-2' onClick={() => deletepass(item._id)}>Delete</button>
                                                            <button className='block w-full text-left px-4 py-2' onClick={() => editpass(item)}>Edit</button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Manager;
