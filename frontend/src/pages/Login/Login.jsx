import axios from 'axios';
import { Loader } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false)


    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)

        const payload = {
            email: email,
            password: password
        }

        axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/login`, payload)
            .then((res) => {
                toast("Login Successful");
                // console.log("Login done", res);
                localStorage.setItem('token', JSON.stringify(res.data.token))
            })
            .catch((err) => {
                toast("Invalid Credencial");
                console.log("Error while login", err)
            })
            .finally(() => {
                setLoading(false);
                window.location.reload();
            })
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit}>
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
            </div>
        </div>
    );
};

export default Login;