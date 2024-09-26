import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const AboutSection = ({ userData, authUser }) => {
  const [toggle, setToggle] = useState(false);
  const [profileToEdit, setProfileToEdit] = useState(null);

  useEffect(() => {
    if (userData) {
      setProfileToEdit(userData);
    }
  }, [userData]);


  const handleToggle = () => {
    setToggle((prev) => !prev); // Toggle between edit and view
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileToEdit((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // update data submit functionality
  const handleSave = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem('token'));

    const headers = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const { about } = profileToEdit;

    const updateUser = { about };


    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/user/updateprofile`, updateUser, headers);
      toast.success(res.data.message);

      // Update the state with the new data immediately after successful response
      setProfileToEdit((prevState) => ({
        ...prevState,
        ...res.data // Assuming the updated data comes from the response
      }));
      setToggle(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating profile');
      console.error("Error while updating profile", err);
    }
  };


  const isOwner = authUser?._id === userData?._id; // Check if viewing own profile


  return (
    <div className='bg-white shadow rounded-lg p-6 mb-6'>
      <h2 className='text-xl font-semibold mb-4'>About</h2>
      {profileToEdit && (
        <>
          {toggle ? (
            <>
              {
                isOwner && (
                  <>
                    <textarea
                      className='w-full p-2 border rounded'
                      rows='4'
                      name='about'
                      value={profileToEdit?.about} // Bind textarea value to state
                      onChange={handleChange} // Handle changes in textarea
                    />
                    <button
                      onClick={handleSave} // Save on button click
                      className='mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300'
                    >
                      Save
                    </button>
                    <button
                      onClick={handleToggle} // Toggle back to view mode
                      className='mt-2 ml-2  transition duration-300 bg-red-500 p-2 rounded-md hover:bg-red-700 text-white'
                    >
                      Cancel
                    </button>
                  </>

                )
              }
            </>
          ) : (
            <>
              <p>{profileToEdit?.about}</p>
              {
                isOwner && (
                  <button
                    onClick={handleToggle} // Toggle to edit mode
                    className='mt-2 text-white hover:text-white transition duration-300 bg-black px-4 py-2 rounded-md'
                  >
                    Edit
                  </button>
                )
              }
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AboutSection;
