import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { BsFillEnvelopeFill, BsLinkedin } from "react-icons/bs";
import useAuth from "../hooks/useAuth";
import axios from "axios";

export default function Profile() {
  const { isLoggedIn, authUser, setAuthUser } = useAuth();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/signin");
    }
  }, [isLoggedIn, navigate]);

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profileBanner", file);

      try {
        const { data } = await axios.post(
          `http://localhost:8000/auth/updateProfileBanner`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setAuthUser((prevAuthUser) => ({
          ...prevAuthUser,
          profileBanner: data.profileBanner,
        }));
        toast.success("Profile banner updated successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } catch (error) {
        toast.error("Failed to update profile banner.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
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
              className="w-full h-40 object-cover"
              src="https://via.placeholder.com/1500x400" // Replace with a real banner image URL
              alt="profile banner"
            />
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 cursor-pointer">
              <label htmlFor="avatarInput">
                <img
                  className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800"
                  src={authUser.profileBanner}
                  alt="profile"
                />
              </label>
              <input
                type="file"
                id="avatarInput"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
          </div>
          {/* Profile Information */}
          <div className="text-center mt-16 mb-6">
            <h2 className="text-2xl font-semibold">{authUser.username}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {authUser.currentLocation
                ? authUser.currentLocation.name
                : "Location empty"}
            </p>
          </div>
          {/* Navigation Tabs */}
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
        </div>
      </div>
    </div>
  );
}
