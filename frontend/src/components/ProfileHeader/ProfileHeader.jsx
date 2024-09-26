import React, { useEffect, useState } from 'react';
import { Camera, MapPin } from "lucide-react";
import axios from 'axios';
import { toast } from 'react-toastify';


const ProfileHeader = ({ userData, authUser }) => {
  const [profileToEdit, setProfileToEdit] = useState(null);
  const [bannerImage, setBannerImage] = useState('');
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    if (userData) {
      setProfileToEdit(userData);
    }
  }, [userData]);


  // update data submit functionality
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem('token'));

    const headers = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const { name, headline, location } = profileToEdit;

    const updateUser = { name, headline, location };

    // bannerImage functionality
    if (bannerImage) updateUser.bannerImg = await readFileAsDataURL(bannerImage);
    // profileImage functionality
    if (profileImage) updateUser.profilePicture = await readFileAsDataURL(profileImage);

    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/user/updateprofile`, updateUser, headers);
      toast.success(res.data.message);

      // Update the state with the new data immediately after successful response
      setProfileToEdit((prevState) => ({
        ...prevState,
        bannerImg: bannerImage ? URL.createObjectURL(bannerImage) : prevState.bannerImg,
        profilePicture: profileImage ? URL.createObjectURL(profileImage) : prevState.profilePicture,
        ...res.data // Assuming the updated data comes from the response
      }));

    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating profile');
      console.error("Error while updating profile", err);
    }
  };


  //bannerImage handleChange
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImage(file);
    }
  };

  // ProfileImage handleChange
  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  // input name location hiline handlechage functionality
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileToEdit((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };



  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const isOwner = authUser?._id === userData?._id; // Check if viewing own profile

  return (
    <div className='bg-white shadow rounded-lg mb-6'>
      <div
        className='relative h-64 rounded-t-lg bg-cover bg-center' // Increased height from h-48 to h-64
        style={{
          backgroundImage: `url('${bannerImage ? URL.createObjectURL(bannerImage) : (profileToEdit?.bannerImg || '/banner.png')}')`,
          backgroundSize: 'cover', // This is optional; bg-cover does the same
          backgroundPosition: 'center' // This is optional; bg-center does the same
        }}
      >
        {isOwner && (
          <label className='absolute top-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer'>
            <Camera size={20} />
            <input
              type='file'
              className='hidden'
              name='bannerImg'
              accept='image/*'
              onChange={handleBannerChange}
            />
          </label>
        )}
      </div>

      <div className='p-4'>
        <div className='relative -mt-20 mb-4'>
          <img
            className='w-32 h-32 rounded-full mx-auto object-cover'
            src={profileImage ? URL.createObjectURL(profileImage) : profileToEdit?.profilePicture || "/avatar.png"}
            alt={'Profile'}
          />

          {isOwner && (
            <label className='absolute bottom-0 right-1/2 transform translate-x-16 bg-white p-2 rounded-full shadow cursor-pointer'>
              <Camera size={20} />
              <input
                type='file'
                className='hidden'
                name='profilePicture'
                accept='image/*'
                onChange={handleProfileChange}
              />
            </label>
          )}
        </div>

        <div className='text-center mb-4'>
          {isOwner ? (
            <input
              name='name'
              value={profileToEdit?.name || ''} // Provide a fallback value
              onChange={handleChange}
              type='text'
              className='text-2xl font-bold mb-2 text-center w-full'
            />
          ) : (
            <h1 className='text-2xl font-bold mb-2'>{profileToEdit?.name}</h1>
          )}


          {isOwner ? (
            <input
              name='headline'
              onChange={handleChange}
              value={profileToEdit?.headline || ""}
              type='text'
              className='text-gray-600 text-center w-full'
            />
          ) : (
            <p className='text-gray-600'>{profileToEdit?.headline}</p>
          )}

          <div className='flex justify-center items-center mt-2'>
            <MapPin size={16} className='text-gray-500 mr-1' />
            {isOwner ? (
              <input
                name='location'
                value={profileToEdit?.location || ''}
                onChange={handleChange}
                type='text'
                className='text-gray-600 text-center'
              />
            ) : (
              <span className='text-gray-600'>{profileToEdit?.location}</span>
            )}
          </div>
        </div>

        {isOwner && (
          <button
            onClick={handleSubmit}
            className='w-full py-2 px-4 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-300'
          >
            Save Profile
          </button>
        )}
      </div>


    </div >
  );
};

export default ProfileHeader;




{/* Profile Info */ }
{/* <div className='p-4'>
        <div className='relative -mt-20 mb-4'>
          <img
            className='w-32 h-32 rounded-full mx-auto object-cover'
            src={avatarToEdit ? URL.createObjectURL(avatarToEdit) : profileToEdit?.profilePicture || "/avatar.png"}
            alt={'Profile'}
          />

          {isOwner && (
            <label className='absolute bottom-0 right-1/2 transform translate-x-16 bg-white p-2 rounded-full shadow cursor-pointer'>
              <Camera size={20} />
              <input
                type='file'
                className='hidden'
                name='profilePicture'
                accept='image/*'
                onChange={handleProfileChange}
              />
            </label>
          )}
        </div>

        <div className='text-center mb-4'>
          {isOwner ? (
            <input
              name='name'
              value={profileToEdit?.name || ''}
              onChange={handleChange}
              type='text'
              className='text-2xl font-bold mb-2 text-center w-full'
            />
          ) : (
            <h1 className='text-2xl font-bold mb-2'>{profileToEdit?.name || ''}</h1>
          )}

          {isOwner ? (
            <input
              name='headline'
              onChange={handleChange}
              value={profileToEdit?.headline || ''}
              type='text'
              className='text-gray-600 text-center w-full'
            />
          ) : (
            <p className='text-gray-600'>{profileToEdit?.headline}</p>
          )}

          <div className='flex justify-center items-center mt-2'>
            <MapPin size={16} className='text-gray-500 mr-1' />
            {isOwner ? (
              <input
                name='location'
                value={profileToEdit?.location || ''}
                onChange={handleChange}
                type='text'
                className='text-gray-600 text-center'
              />
            ) : (
              <span className='text-gray-600'>{profileToEdit?.location}</span>
            )}
          </div>
        </div>

        {isOwner && (
          <button
            onClick={handleSave}
            className='w-full py-2 px-4 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-300'
          >
            Save Profile
          </button>
        )}
      </div> */}
