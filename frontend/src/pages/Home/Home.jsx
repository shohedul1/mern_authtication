import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import axios from 'axios'
import { Users } from 'lucide-react'
import PostCreation from '../../components/PostCreation/PostCreation'
import Post from '../../components/Post/Post'

const Home = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState('');
  const [posts, setPosts] = useState([])



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
        setLoading(false)
      })
      .finally(() => {
        setLoading(true)
      })
  }

  const fetchPost = () => {
    const header = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    axios.post(`http://localhost:5000/user/post`, {}, header)
      .then((res) => {
        setPosts(res.data.data)
        // console.log("User data fetched", res);
      })
      .catch((err) => {
        console.log("Error while fetch data", err)
        setLoading(false)
      })
      .finally(() => {
        setLoading(true)
      })
  }

  // console.log('posts', posts);

  useEffect(() => {
    fetchData();
    fetchPost();
  }, [])
  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='hidden lg:block lg:col-span-1'>
        <Sidebar user={data} loading={loading} />
      </div>

      <div className='col-span-1 lg:col-span-2 order-first lg:order-none'>
        <PostCreation user={data} loading={loading} />

        {posts.map((post) => (
          <Post key={post._id} post={post} data={data} />
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

      {/* {recommendedUsers?.length > 0 && (
        <div className='col-span-1 lg:col-span-1 hidden lg:block'>
          <div className='bg-secondary rounded-lg shadow p-4'>
            <h2 className='font-semibold mb-4'>People you may know</h2>
            {recommendedUsers?.map((user) => (
              <RecommendedUser key={user._id} user={user} />
            ))}
          </div>
        </div>
      )} */}
    </div>
  )
}

export default Home