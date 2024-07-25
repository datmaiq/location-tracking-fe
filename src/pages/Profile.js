import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { serverURL } from "../utils/urls";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { BsFillEnvelopeFill, BsLinkedin, BsCamera } from "react-icons/bs";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import AppContext from "../utils/AppContext";

export default function Profile() {
  const { isLoggedIn } = useAuth();
  const { authUser, setAuthUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [profileBannerUrl, setProfileBannerUrl] = useState("");
  const [coverPhotoUrl, setCoverPhotoUrl] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/signin");
    }
  }, [isLoggedIn, navigate]);

  const handleFileChange = async (event, field) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append(field, file);

      try {
        const { data } = await axios.post(
          `${serverURL}/users/${authUser._id}/profile`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const { user } = data;
        setAuthUser(user);

        toast.success(
          `${
            field === "avatar" ? "Profile banner" : "Cover photo"
          } updated successfully!`,
          {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
      } catch (error) {
        console.log(error);
        toast.error(
          `Failed to update ${
            field === "avatar" ? "profile banner" : "cover photo"
          }.`,
          {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
      }
    }
  };

  useEffect(() => {
    if (authUser?.profileBannerId) {
      fetchImage(authUser?.profileBannerId, setProfileBannerUrl);
    }
  }, [authUser?.profileBannerId]);

  useEffect(() => {
    if (authUser?.coverPhotoId) {
      fetchImage(authUser?.coverPhotoId, setCoverPhotoUrl);
    }
  }, [authUser?.coverPhotoId]);

  const fetchImage = async (imageId, setImageUrl) => {
    try {
      const response = await axios.get(`${serverURL}/users/file/${imageId}`, {
        responseType: "blob",
      });
      const imageUrl = URL.createObjectURL(response.data);
      setImageUrl(imageUrl);
    } catch (error) {
      console.log("Failed to fetch image:", error);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-white w-full">
      <div className="pt-10 w-full">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden w-full">
          <div className="relative">
            <img
              key={coverPhotoUrl}
              className="w-full h-40 object-cover"
              src={coverPhotoUrl || "https://via.placeholder.com/1500x400"}
              alt="cover"
              onClick={() => document.getElementById("coverPhotoInput").click()}
            />
            <input
              type="file"
              id="coverPhotoInput"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "coverPhoto")}
            />
            <div className="absolute bottom-3 right-3 cursor-pointer">
              <BsCamera
                onClick={() =>
                  document.getElementById("coverPhotoInput").click()
                }
              />
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 cursor-pointer">
              <label htmlFor="avatarInput">
                <img
                  key={profileBannerUrl}
                  className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800"
                  src={
                    profileBannerUrl ||
                    "https://img.icons8.com/?size=160&id=492ILERveW8G&format=png"
                  }
                  alt="profile"
                />
              </label>
              <input
                type="file"
                id="avatarInput"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "avatar")}
              />
              <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 cursor-pointer">
                <BsCamera
                  onClick={() => document.getElementById("avatarInput").click()}
                />
              </div>
            </div>
          </div>
          <div className="text-center mt-16 mb-6">
            <h2 className="text-2xl font-semibold">{authUser.username}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {authUser.currentLocation
                ? authUser.currentLocation.name
                : "Location empty"}
            </p>
          </div>
          <div className="flex justify-around border-t border-gray-300 dark:border-gray-700 pt-3">
            <Link
              to="#"
              className="flex flex-col items-center text-sm text-gray-600 dark:text-gray-300"
            >
              <span className="font-semibold">{authUser?.friends?.length}</span>
              <span>Friends</span>
            </Link>
            <Link
              to="#"
              className="flex flex-col items-center text-sm text-gray-600 dark:text-gray-300"
            >
              <span className="font-semibold">
                {authUser?.locations?.length}
              </span>
              <span>Locations</span>
            </Link>
          </div>
          <div className="flex justify-end space-x-2 mr-5 mt-5">
            <Link
              to="/my-locations"
              className="flex items-center space-x-2 p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg shadow"
            >
              <span>Locations</span>
            </Link>
            <Link
              to="/my-friends"
              className="flex items-center space-x-2 p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg shadow"
            >
              <span>Friends</span>
            </Link>
            <button
              type="button"
              className="flex items-center space-x-2 p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg shadow"
            >
              <CopyToClipboard
                text={`${window.location.href}/${authUser?.username}`}
                onCopy={() => {
                  setCopied(true);
                  toast.success("Link copied to clipboard!", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                }}
              >
                <div>
                  {copied ? <span>Copied!</span> : <span>Share Profile</span>}
                </div>
              </CopyToClipboard>
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-3">About</h3>
                <p className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                  <BsFillEnvelopeFill className="mr-2" />
                  {authUser?.username}@gmail.com
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-3">Social</h3>
                <p className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                  <BsLinkedin className="mr-2" />
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-3">
              Connections ({authUser?.friends?.length || 0})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {authUser?.friends?.map((friend) => (
                <Link key={friend._id} to={`/profile/${friend.username}`}>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow flex flex-col items-center">
                    <img
                      className="w-20 h-20 rounded-full mb-3"
                      src={
                        friend.profileBanner ||
                        "https://via.placeholder.com/150"
                      }
                      alt={`${friend.username}'s avatar`}
                    />
                    <p className="text-center text-sm font-semibold">
                      {friend.username}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
