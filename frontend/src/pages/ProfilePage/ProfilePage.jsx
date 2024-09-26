import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AboutSection from "../../components/AboutSection/AboutSection";
import axios from "axios";
import { toast } from "react-toastify";
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import ExperienceSection from "../../components/ExperienceSection/ExperienceSection";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);  // Default as an empty object
  const [authUser, setAuthUser] = useState(null); // Authenticated user data

  // Fetch authenticated user data
  const fetchData = async () => {
    const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null;
    if (!token) return;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/profile`, {}, { headers });
      setAuthUser(res.data.data);
    } catch (err) {
      console.error('Error while fetching data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const token = JSON.parse(localStorage.getItem('token'));
  const { username } = useParams();
  // get data username filtering 
  const fetchProfile = () => {
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/${username}`, {}, header)
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => {
        toast(err.response.data.message || "Error fetching profile");
        console.log("Error while fetching profile", err);
      });
  };

  useEffect(() => {
    fetchProfile();
  }, [username]);


  return (
    <div className='max-w-4xl mx-auto p-4'>
      <ProfileHeader userData={userData} authUser={authUser} />
      <AboutSection userData={userData} authUser={authUser} />
      <ExperienceSection userData={userData} authUser={authUser} />

    </div>
  );
}

export default ProfilePage;
