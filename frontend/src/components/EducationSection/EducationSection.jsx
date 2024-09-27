

import axios from 'axios';
import { School } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const EducationSection = ({ userData, authUser }) => {
  const [toggle, setToggle] = useState(false);
  const [profileToEdit, setProfileToEdit] = useState(null);
  const [newEducation, setNewEducation] = useState({
    school: '',
    fieldOfStudy: '',
    startYear: '',
    endYear: '',
  });

  useEffect(() => {
    if (userData) {
      setProfileToEdit(userData);
    }
  }, [userData]);

  // Toggle between edit and view
  const handleToggle = () => {
    setToggle((prev) => !prev);
  };

  // Change handler for form inputs
  const handleExperienceChange = (e) => {
    const { name, value } = e.target;
    setNewEducation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit education data update
  const handleAddEducation = async () => {
    const token = JSON.parse(localStorage.getItem('token'));
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const updatedEducation = [...(profileToEdit?.education || []), newEducation];

      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/user/updateprofile`,
        { education: updatedEducation },
        headers
      );

      toast.success(res.data.message);

      // Update the profileToEdit state
      setProfileToEdit((prevState) => ({
        ...prevState,
        education: updatedEducation,
      }));

      // Reset the newEducation form
      setNewEducation({
        school: '',
        fieldOfStudy: '',
        startYear: '',
        endYear: '',
      });

      setToggle(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding education');
      console.error('Error while adding education', err);
    }
  };

  // Delete an education entry
  const handleDeleteEducation = async (indexToDelete) => {
    const token = JSON.parse(localStorage.getItem('token'));
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      // Remove only the selected education entry by index
      const updatedEducation = profileToEdit?.education?.filter((edu, index) => index !== indexToDelete);

      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/user/updateprofile`,
        { education: updatedEducation },
        headers
      );

      toast.success('Education deleted successfully');

      // Update the profileToEdit state
      setProfileToEdit((prevState) => ({
        ...prevState,
        education: updatedEducation,
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting education');
      console.error('Error while deleting education', err);
    }
  };



  const isOwner = authUser?._id === userData?._id; // Check if viewing own profile

  return (
    <div className='bg-white shadow rounded-lg p-6 mb-6'>
      <h2 className='text-xl font-semibold mb-4'>Education</h2>
      {profileToEdit?.education?.map((edu, index) => (
        <div key={edu?._id} className='mb-4 flex justify-between items-start'>
          <div className='flex items-start'>
            <School size={20} className='mr-2 mt-1' />
            <div>
              <h3 className='font-semibold'>{edu?.fieldOfStudy}</h3>
              <p className='text-gray-600'>{edu?.school}</p>
              <p className='text-gray-500 text-sm'>
                {edu?.startYear} - {edu?.endYear || 'Present'}
              </p>
            </div>
          </div>
          {isOwner && (
            <button
              onClick={() => handleDeleteEducation(index)}
              className='text-red-500'
            >
              Delete
            </button>
          )}
        </div>
      ))}

      {isOwner && toggle && (
        <div className='mt-4'>
          <input
            type='text'
            onChange={handleExperienceChange}
            name='school'
            placeholder='School'
            value={newEducation.school}
            className='w-full p-2 border rounded mb-2'
          />
          <input
            type='text'
            placeholder='Field of Study'
            onChange={handleExperienceChange}
            name='fieldOfStudy'
            value={newEducation.fieldOfStudy}
            className='w-full p-2 border rounded mb-2'
          />
          <input
            type='number'
            placeholder='Start Year'
            value={newEducation.startYear}
            onChange={handleExperienceChange}
            name='startYear'
            className='w-full p-2 border rounded mb-2'
          />
          <input
            type='number'
            placeholder='End Year'
            value={newEducation.endYear}
            onChange={handleExperienceChange}
            name='endYear'
            className='w-full p-2 border rounded mb-2'
          />
          <button
            onClick={handleAddEducation}
            className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-900 transition duration-300'
          >
            Add Education
          </button>
        </div>
      )}

      {isOwner && (
        <button
          onClick={handleToggle}
          className='mt-4 bg-black text-white py-2 px-4 rounded transition duration-300'
        >
          {toggle ? 'Cancel' : 'Edit Education'}
        </button>
      )}
    </div>
  );
};

export default EducationSection;

