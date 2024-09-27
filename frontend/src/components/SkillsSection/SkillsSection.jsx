import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

const SkillsSection = ({ userData, authUser }) => {
  const [toggle, setToggle] = useState(false);
  const [profileToEdit, setProfileToEdit] = useState(null);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (userData) {
      setProfileToEdit(userData);
    }
  }, [userData]);

  // Toggle between edit and view
  const handleToggle = () => {
    setToggle((prev) => !prev);
  };

  // Add a new skill
  const handleAddSkill = async () => {
    if (newSkill.trim() === '') {
      toast.error('Please enter a valid skill.');
      return;
    }

    const token = JSON.parse(localStorage.getItem('token'));
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const updatedSkills = [...(profileToEdit?.skills || []), newSkill];

      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/user/updateprofile`,
        { skills: updatedSkills },
        headers
      );

      toast.success(res.data.message);

      // Update the profile state with new skill
      setProfileToEdit((prevState) => ({
        ...prevState,
        skills: updatedSkills,
      }));

      // Reset the input field
      setNewSkill('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding skill');
      console.error('Error while adding skill', err);
    }
  };

  // Delete a skill
  const handleDeleteSkill = async (skillToDelete) => {

    const token = JSON.parse(localStorage.getItem('token'));
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      // Filter out the skill to be deleted
      const updatedSkills = profileToEdit?.skills?.filter((skill, index) => index !== skillToDelete);

      console.log('Updated skills:', updatedSkills); // Debugging log

      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/user/updateprofile`,
        { skills: updatedSkills },
        headers
      );
      if (res) {
        toast.success('Skill deleted successfully');
      }

      // Update the profile state after deleting the skill
      setProfileToEdit((prevState) => ({
        ...prevState,
        skills: updatedSkills, // This ensures a fresh copy is set in the state
      }));

      console.log('Profile after delete:', profileToEdit?.skills); // Debugging log
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting skill');
      console.error('Error while deleting skill', err);
    }
  };

  const isOwner = authUser?._id === userData?._id; // Check if viewing own profile

  return (
    <div className='bg-white shadow rounded-lg p-6'>
      <h2 className='text-xl font-semibold mb-4'>Skills</h2>
      <div className='flex flex-wrap'>
        {profileToEdit?.skills?.map((skill, index) => (
          <span
            key={index} // Ensure each key is unique
            className='bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm mr-2 mb-2 flex items-center'
          >
            {skill}
            {isOwner && (
              <button
                className='ml-2 text-red-500'
                onClick={() => handleDeleteSkill(index)} // Handle delete
              >
                <X />
              </button>
            )}
          </span>
        ))}
      </div>

      {toggle && (
        <div className='mt-4 flex'>
          <input
            type='text'
            placeholder='New Skill'
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className='flex-grow p-2 border rounded-l'
          />
          <button
            onClick={handleAddSkill} // Handle add skill
            className='bg-black text-white py-2 px-4 rounded-r transition duration-300'
          >
            Add Skill
          </button>
        </div>
      )}

      {isOwner && (
        <button
          onClick={handleToggle}
          className='mt-4 bg-black text-white py-2 px-4 rounded transition duration-300'
        >
          {toggle ? 'Cancel' : 'Edit Skills'}
        </button>
      )}
    </div>
  );
};

export default SkillsSection;
