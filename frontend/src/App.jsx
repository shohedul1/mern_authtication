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
import Loader from './components/Loader/Loader'


const App = () => {
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(false)



    const token = JSON.parse(localStorage.getItem('token'))

    const fetchData = () => {
        setLoading(true)

        const header = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/profile`, {}, header)
            .then((res) => {
                setAuthUser(res.data.data)
                // console.log("User data fetched", res);
            })
            .catch((err) => {
                console.log("Error while fetch data", err)
                setLoading(false)

            })
            .finally(() => {
                setLoading(false)

            })
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (

        <>
            {
                loading ? (
                    <Loader />
                ) : (
                    <Layout>
                        <Routes>
                            <Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
                            <Route path='/signup' element={!authUser ? <Registration /> : <Navigate to={"/"} />} />
                            <Route path='/login' element={!authUser ? <Login /> : <Navigate to={"/"} />} />
                            <Route path='/notifications' element={authUser ? <NotificationsPage /> : <Navigate to={"/login"} />} />
                            <Route path='/network' element={authUser ? <NetworkPage /> : <Navigate to={"/login"} />} />
                            <Route path='/post/:postId' element={authUser ? <PostPage /> : <Navigate to={"/login"} />} />
                            <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />} />
                        </Routes>
                    </Layout>
                )
            }
            <ToastContainer />

        </>
    )
}

export default App