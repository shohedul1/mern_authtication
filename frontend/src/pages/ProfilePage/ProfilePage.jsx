import React, { useEffect, useState } from 'react';
import ProfileHeader from '../../components/ProfileHeader/ProfileHeader';
import AboutSection from '../../components/AboutSection/AboutSection';
import ExperienceSection from '../../components/ExperienceSection/ExperienceSection';
import EducationSection from '../../components/EducationSection/EducationSection';
import SkillsSection from '../../components/SkillsSection/SkillsSection';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const [userData, setUserData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});  // Added state for editedData

  const token = JSON.parse(localStorage.getItem('token'));
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const { username } = useParams();

  const isOwnProfile = loggedInUser?.username === username;

  const fetchSuggestions = () => {
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/post/${username}`, {}, header)
      .then((res) => {
        setUserData(res.data);
        setEditedData(res.data); // Initialize editedData with fetched user data
      })
      .catch((err) => {
        toast(err.response?.data?.message || "Error while fetching suggestions");
        console.log("Error while fetching suggestions", err);
      });
  };

  useEffect(() => {
    fetchSuggestions();
  }, [username]);

  const handleSave = () => {
    // Your logic for saving profile changes
    setIsEditing(false);
    console.log('Profile saved:', editedData); // Save editedData here
  };

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <ProfileHeader
        userData={userData}
        isOwnProfile={isOwnProfile}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editedData={editedData}
        setEditedData={setEditedData}
        onSave={handleSave}
      />
      <AboutSection />
      <ExperienceSection />
      <EducationSection />
      <SkillsSection />
    </div>
  );
}

export default ProfilePage;
