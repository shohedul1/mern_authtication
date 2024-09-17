import React, { useEffect, useState } from 'react'
import Layout from './components/Layout/Layout'
import Home from './pages/Home/Home'
import Registration from './pages/Registration/Registration'
import Login from './pages/Login/Login'
import NotificationsPage from './pages/NotificationsPage/NotificationsPage'
import PostPage from './pages/PostPage/PostPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import NetworkPage from './pages/NetworkPage/NetworkPage'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'


const App = () => {
    // const authUser = false;
    const [data, setData] = useState('');



    const token = JSON.parse(localStorage.getItem('token'))

    const fetchData = () => {
        const header = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/profile`, {}, header)
            .then((res) => {
                setData(res.data.data)
                // console.log("User data fetched", res);
            })
            .catch((err) => {
                console.log("Error while fetch data", err)
            })
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (

        <Layout>
            <Routes>
                <Route path='/' element={data ? <Home /> : <Navigate to={"/login"} />} />
                <Route path='/signup' element={!data ? <Registration /> : <Navigate to={"/"} />} />
                <Route path='/login' element={!data ? <Login /> : <Navigate to={"/"} />} />
                <Route path='/notifications' element={data ? <NotificationsPage /> : <Navigate to={"/login"} />} />
                <Route path='/network' element={data ? <NetworkPage /> : <Navigate to={"/login"} />} />
                <Route path='/post/:postId' element={data ? <PostPage /> : <Navigate to={"/login"} />} />
                <Route path='/profile/:username' element={data ? <ProfilePage /> : <Navigate to={"/login"} />} />
            </Routes>
            <ToastContainer />

        </Layout>
    )
}

export default App