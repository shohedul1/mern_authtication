
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/dateUtils';

const ExperienceSection = ({ userData, authUser }) => {
  const [toggle, setToggle] = useState(false);
  const [profileToEdit, setProfileToEdit] = useState(null);
  const [experience, setNewExperience] = useState({
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
    currentlyWorking: false,
  });

  useEffect(() => {
    if (userData) {
      setProfileToEdit(userData);
    }
  }, [userData]);

  const handleToggle = () => {
    setToggle((prev) => !prev); // Toggle between edit and view
  };

  const handleExperienceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewExperience((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddExperience = async () => {
    const token = JSON.parse(localStorage.getItem('token'));
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const updatedExperience = [...profileToEdit.experience, experience];

      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/user/updateprofile`,
        { experience: updatedExperience },
        headers
      );

      toast.success(res.data.message);

      setProfileToEdit((prevState) => ({
        ...prevState,
        experience: updatedExperience,
      }));

      setNewExperience({
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
        currentlyWorking: false,
      });
      setToggle(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding experience');
      console.error("Error while adding experience", err);
    }
  };

  // Delete experience functionality
  const handleDeleteExperience = async (ExperienceToDelete) => {
    const token = JSON.parse(localStorage.getItem('token'));
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const updatedExperience = profileToEdit.experience.filter((exp, index) => index !== ExperienceToDelete);

      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/user/updateprofile`,
        { experience: updatedExperience },
        headers
      );
      if (res) {
        toast.success("Experience deleted successfully")
      }
      setProfileToEdit((prevState) => ({
        ...prevState,
        experience: updatedExperience,
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting experience');
      console.error("Error while deleting experience", err);
    }
  };

  const isOwner = authUser?._id === userData?._id; // Check if viewing own profile

  return (
    <div className='bg-white shadow rounded-lg p-6 mb-6'>
      <h2 className='text-xl font-semibold mb-4'>Experience</h2>
      {profileToEdit?.experience?.map((exp, index) => (
        <div key={exp?._id || index} className='mb-4 flex justify-between items-start'>
          <div className='flex items-start'>
            <div>
              <h3 className='font-semibold'>{exp?.title}</h3>
              <p className='text-gray-600'>{exp?.company}</p>
              <p className='text-gray-500 text-sm'>
                {formatDate(exp?.startDate)} - {exp?.endDate ? formatDate(exp?.endDate) : "Present"}
              </p>
              <p className='text-gray-700'>{exp?.description}</p>
            </div>
          </div>
          {isOwner && (
            <button onClick={() => handleDeleteExperience(index)} className='text-red-500'>
              Delete
            </button>
          )}
        </div>
      ))}

      {isOwner && (
        <>
          {toggle && (
            <div className='mt-4'>
              <h3 className='text-lg font-semibold mb-2'>Add New Experience</h3>
              <input
                type='text'
                name='title'
                placeholder='Title'
                value={experience.title}
                onChange={handleExperienceChange}
                className='w-full p-2 border rounded mb-2'
              />
              <input
                type='text'
                name='company'
                placeholder='Company'
                value={experience.company}
                onChange={handleExperienceChange}
                className='w-full p-2 border rounded mb-2'
              />
              <input
                type='date'
                name='startDate'
                value={experience.startDate}
                onChange={handleExperienceChange}
                className='w-full p-2 border rounded mb-2'
              />
              <div className='flex items-center mb-2'>
                <input
                  type='checkbox'
                  name='currentlyWorking'
                  checked={experience.currentlyWorking}
                  onChange={handleExperienceChange}
                  className='mr-2'
                />
                <label htmlFor='currentlyWorking'>I currently work here</label>
              </div>
              {!experience.currentlyWorking && (
                <input
                  type='date'
                  name='endDate'
                  value={experience.endDate}
                  onChange={handleExperienceChange}
                  className='w-full p-2 border rounded mb-2'
                  placeholder='End Date'
                />
              )}
              <textarea
                name='description'
                placeholder='Description'
                value={experience.description}
                onChange={handleExperienceChange}
                className='w-full p-2 border rounded mb-2'
              />
              <button
                onClick={handleAddExperience}
                className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-900 transition duration-300'
              >
                Add Experience
              </button>
            </div>
          )}
        </>
      )}

      {isOwner && (
        <button
          onClick={handleToggle}
          className='mt-4 bg-black text-white py-2 px-4 rounded transition duration-300'
        >
          {toggle ? 'Cancel' : 'Edit Experiences'}
        </button>
      )}
    </div>
  );
};

export default ExperienceSection;

