import React, { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import 'react-toastify/dist/ReactToastify.css';

const Manager = () => {
    const ref = useRef();
    const ref2 = useRef();
    const contref = useRef();
    const [form, setform] = useState({ site: "", username: "", password: "" });
    const [passArray, setpassArray] = useState([]);
    const [showOptions, setShowOptions] = useState(null);

    const getpasswords = async () => {
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json();
        console.log(passwords)

        try {
            setpassArray(passwords);
        } catch (error) {
            console.error("Error parsing passwords:", error);
            setpassArray([]);
        }
        //you must allow cors in your backend, go through expressjs cors middleware page.

    }
    

    useEffect(() => {
        getpasswords()
    }, []);

    useEffect(() => {
        const contheight = contref.current.scrollHeight + 120;
        contref.current.style.height = `${contheight}px`
    }, [passArray])



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
        if (!form.site || !form.username || !form.password) {
            toast.error('Please fill in all fields before saving.', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            return;
        }

        const newPass = { ...form, id: uuidv4() };
        const updatedPassArray = [...passArray, newPass];
        setpassArray(updatedPassArray);
        
        //if any entries with same id exists in db, then delete the previous one.
        await fetch("http://localhost:3000/",{method: "DELETE", headers: {"Content-Type": "application/json"}, 
        body: JSON.stringify({id: form.id})})

        await fetch("http://localhost:3000/",{method: "POST", headers: {"Content-Type": "application/json"}, 
        body: JSON.stringify({ ...form, id: uuidv4() })})

        toast.success('password saved.', {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        })
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
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    const options = (index) => {
        setShowOptions(showOptions === index ? null : index);
    };

    const deletepass = async (id) => {
        let c = confirm("Please confirm to delete this password.");
        if (c) {
            const updatedPassArray = passArray.filter(item => item.id !== id);
            setpassArray(updatedPassArray);

            await fetch("http://localhost:3000/",{method: "DELETE", headers: {"Content-Type": "application/json"}, 
            body: JSON.stringify({id})})

            toast.success('Password deleted.', {
                position: "bottom-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    const editpass = (id) => {
        const passToEdit = passArray.find(item => item.id === id);
        setform({...passToEdit, id: id});
        const updatedPassArray = passArray.filter(item => item.id !== id);
        setpassArray(updatedPassArray);
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
            <div className="absolute inset-0 -z-10 h-full w-full bg-purple-500 [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>

            <div ref={contref} className='md:mycontainer bg-purple-100 mx-auto mb-3 max-w-6xl'>
                <h3 className='text-3xl font-bold text-center w-35'>
                    <span className="text-green-800 font-extrabold">&lt;</span>
                    <span>PassHandler</span>
                    <span className="text-green-800 font-extrabold">/&gt;</span>
                </h3>
                <p className="text-green-800 text-lg text-center w-35 mt-2">Never forget a password again.</p>

                <div className="text-black flex flex-col p-3 gap-6">
                    <input value={form.site} onChange={handlechange} placeholder='Website URL' type="text" className="rounded-full border border-green-900 w-full px-4" name='site' />

                    <div className="flex flex-col md:flex-row gap-5">
                        <input value={form.username} onChange={handlechange} placeholder='Username' type="text" className="rounded-full border border-green-900 w-full px-4" name='username' />

                        <div className="relative">
                            <input ref={ref2} value={form.password} onChange={handlechange} placeholder='Password' type="password" className="rounded-full border border-green-900 w-full px-4" name='password' />
                            <span className='absolute right-1 font-light hover:cursor-pointer' onClick={showpass}>
                                <img ref={ref} width={23} src="icons/eye.png" alt="show" />
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center w-35 justify-center">
                        <button onClick={savepass} className="group flex items-center justify-center bg-green-400 border-2 border-green-600 rounded-full m-2 p-2 text-black hover:bg-green-500 w-24">
                            <lord-icon
                                src="https://cdn.lordicon.com/slmechys.json"
                                trigger="loop-on-hover"
                                className="group-hover:trigger"
                                style={{ width: "30px", height: "30px" }}>
                            </lord-icon>
                            Save
                        </button>
                    </div>

                    <div className="container">
                        <h2 className='font-bold text-2xl py-3'>Credentials</h2>
                        {passArray.length === 0 && <div>Nothing to show. Please save a password above.</div>}

                        {passArray.length !== 0 &&
                            <table className="table-auto w-full rounded-lg overflow-hidden">
                                <thead className='bg-purple-400 text-black'>
                                    <tr>
                                        <th className='my-2 py-1'>Website URL</th>
                                        <th className='my-2 py-1'>Username</th>
                                        <th className='my-2 py-1'>Password</th>
                                        <th className='my-2 py-1'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='bg-purple-100 rounded-md overflow-hidden'>
                                    {passArray.map((item, index) => (
                                        <tr key={item.id}>
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


                                            <td className='text-center cursor-pointer'>
                                                <button className='w-8 h-4' onClick={() => options(index)}>
                                                    <img src="icons/option.svg" alt="options" />
                                                </button>

                                                {showOptions === index && (
                                                    <div className='absolute bg-slate-100 border rounded shadow-lg'>
                                                        <button className='block w-full text-left px-4 py-2' onClick={() => deletepass(item.id)}>Delete</button>
                                                        <button className='block w-full text-left px-4 py-2' onClick={() => editpass(item.id)}>Edit</button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Manager;
