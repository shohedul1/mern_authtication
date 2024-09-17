import axios from 'axios';
import { Loader } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Registration() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUserName] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();


    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            username: username,
            name: name,
            email: email,
            password: password,
        };

        axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/register`, payload)
            .then((res) => {
                toast.success("Registration Successful");
                // console.log("User registered:", res);
            })
            .catch((err) => {
                setLoading(false);
                if (err.response && err.response.data && err.response.data.message) {
                    toast.error(`Registration Failed: ${err.response.data.message}`);
                } else {
                    toast.error("Registration Failed");
                }
                console.log("Error during registration:", err);
            })
            .finally(() => {
                setLoading(false);  // Always set loading to false once the request is complete
                setName('');
                setUserName('');
                setEmail('');
                setPassword('');
                setTimeout(() => {
                    navigate("/")
                }, 5000)

            })
    };

    return (

        <div className='min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
            <div className='sm:mx-auto sm:w-full sm:max-w-md'>
                <img className='mx-auto h-36 w-auto' src='/logo.svg' alt='LinkedIn' />
                <h2 className='text-center text-3xl font-extrabold text-gray-900'>
                    Make the most of your professional life
                </h2>
            </div>
            <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md shadow-md'>
                <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
                    {/* <SignUpForm /> */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUserName(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex justify-center"
                        >
                            {loading ? <Loader className='size-5 animate-spin' /> : "Login"}
                        </button>
                    </form>

                    <div className='mt-6'>
                        <div className='relative'>
                            <div className='absolute inset-0 flex items-center'>
                                <div className='w-full border-t border-gray-300'></div>
                            </div>
                            <div className='relative flex justify-center text-sm'>
                                <span className='px-2 bg-white text-gray-500'>Already on LinkedIn?</span>
                            </div>
                        </div>
                        <div className='mt-6'>
                            <Link
                                to='/login'
                                className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-gray-50'
                            >
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Registration;
