import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import axios from 'axios'
import { Users } from 'lucide-react'
import PostCreation from '../../components/PostCreation/PostCreation'
import Post from '../../components/Post/Post'
import RecommendedUser from '../../components/RecommendedUser/RecommendedUser'
import { toast } from 'react-toastify'

const Home = () => {
  const [authUser, setAuthUser] = useState('');
  const [posts, setPosts] = useState([]);
  const [recommendedUsers, setRecommendedUsers] = useState([])

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };



  const token = JSON.parse(localStorage.getItem('token'));

  const fetchData = () => {
    const header = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/profile`, {}, header)
      .then((res) => {
        setAuthUser(res.data)
        // console.log("User data fetched", res);
      })
      .catch((err) => {
        console.log("Error while fetch data", err)
      })
  }

  const fetchPost = () => {
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/post`, header)
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => {
        console.log("Error while fetching posts", err);
      });
  };





  const fetchSuggestions = () => {
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/suggestions`, {}, header)
      .then((res) => {
        // toast("Suggestions fetched successfully");
        // Directly assign res.data since the backend sends an array
        setRecommendedUsers(res.data);
      })
      .catch((err) => {
        toast(err.response?.data?.message || "Error while fetching suggestions");
        console.log("Error while fetching suggestions", err);
      });
  };





  useEffect(() => {
    fetchData();
    fetchSuggestions();
    fetchPost();
  }, []);


  // console.log('posts', posts)
  return (
    <>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        <div className='hidden lg:block lg:col-span-1'>
          <Sidebar authUser={authUser} />
        </div>

        <div className='col-span-1 lg:col-span-2 order-first lg:order-none'>
          <PostCreation authUser={authUser} />

          {posts.map((post) => (
            <Post key={post._id} post={post} authUser={authUser} onDelete={handleDeletePost} />
          ))}

          {posts?.length === 0 && (
            <div className='bg-white rounded-lg shadow p-8 text-center'>
              <div className='mb-6'>
                <Users size={64} className='mx-auto text-blue-500' />
              </div>
              <h2 className='text-2xl font-bold mb-4 text-gray-800'>No Posts Yet</h2>
              <p className='text-gray-600 mb-6'>Connect with others to start seeing posts in your feed!</p>
            </div>
          )}
        </div>

        {recommendedUsers?.data?.length > 0 && (
          <div className='col-span-1 lg:col-span-1 hidden lg:block'>
            <div className='bg-gray-200 rounded-lg shadow p-4'>
              <h2 className='font-semibold mb-4'>People you may know</h2>
              {recommendedUsers?.data?.map((user) => (
                <RecommendedUser key={user._id} user={user} />
              ))}
            </div>
          </div>
        )}
      </div>

    </>
  )
}

export default Home
