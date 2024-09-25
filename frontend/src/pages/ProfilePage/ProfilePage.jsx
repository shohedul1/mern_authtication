import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AboutSection from "../../components/AboutSection/AboutSection";
import axios from "axios";
import { toast } from "react-toastify";
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);  // Default as an empty object

  const token = JSON.parse(localStorage.getItem('token'));
  const { username } = useParams();

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
      <ProfileHeader userData={userData} />
      {/* <AboutSection userData={userData} /> */}

    </div>
  );
}

export default ProfilePage;
