import React from "react";
import { Camera, MapPin } from "lucide-react";

const ProfileHeader = ({
  userData,
  onSave,
  isOwnProfile,
  isEditing,
  setIsEditing,
  editedData,
  setEditedData,
}) => {
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData((prev) => ({ ...prev, [event.target.name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(editedData); // Send edited data to parent component via onSave callback
  };

  return (
    <div className="bg-white shadow rounded-lg mb-6">
      {/* Banner Image */}
      <div
        className="relative h-48 rounded-t-lg bg-cover bg-center"
        style={{
          backgroundImage: `url('${editedData.bannerImg || userData?.bannerImg || "/banner.png"}')`,
        }}
      >
        {isEditing && (
          <label className="absolute top-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer">
            <Camera size={20} />
            <input
              type="file"
              className="hidden"
              name="bannerImg"
              onChange={handleImageChange}
              accept="image/*"
            />
          </label>
        )}
      </div>

      <div className="p-4">
        {/* Profile Picture */}
        <div className="relative -mt-20 mb-4">
          <img
            className="w-32 h-32 rounded-full mx-auto object-cover"
            src={editedData.profilePicture || userData.profilePicture || "/avatar.png"}
            alt={userData.name}
          />

          {isEditing && (
            <label className="absolute bottom-0 right-1/2 transform translate-x-16 bg-white p-2 rounded-full shadow cursor-pointer">
              <Camera size={20} />
              <input
                type="file"
                className="hidden"
                name="profilePicture"
                onChange={handleImageChange}
                accept="image/*"
              />
            </label>
          )}
        </div>

        {/* User Details */}
        <div className="text-center mb-4">
          {isEditing ? (
            <input
              type="text"
              value={editedData.name ?? userData.name}
              onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
              className="text-2xl font-bold mb-2 text-center w-full"
            />
          ) : (
            <h1 className="text-2xl font-bold mb-2">{userData.name}</h1>
          )}

          {isEditing ? (
            <input
              type="text"
              value={editedData.headline ?? userData.headline}
              onChange={(e) => setEditedData({ ...editedData, headline: e.target.value })}
              className="text-gray-600 text-center w-full"
            />
          ) : (
            <p className="text-gray-600">{userData.headline}</p>
          )}

          <div className="flex justify-center items-center mt-2">
            <MapPin size={16} className="text-gray-500 mr-1" />
            {isEditing ? (
              <input
                type="text"
                value={editedData.location ?? userData.location}
                onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
                className="text-gray-600 text-center"
              />
            ) : (
              <span className="text-gray-600">{userData.location}</span>
            )}
          </div>
        </div>

        {/* Save or Edit Button */}
        {isOwnProfile && (
          <button
            className={`w-full text-white py-2 px-4 rounded-full transition duration-300 ${isEditing ? "bg-primary hover:bg-primary-dark" : "bg-primary hover:bg-primary-dark"
              }`}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
          >
            {isEditing ? "Save Profile" : "Edit Profile"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
