import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useEffect, useState } from "react";
import { FaUserCheck, FaLocationDot } from "react-icons/fa6";
import { CiUser } from "react-icons/ci";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import Leaflet from "leaflet";
import { toast } from "react-toastify";
import { FaFileCsv } from "react-icons/fa";
import serverURL from "../utils/urls";
import useAuth from "../hooks/useAuth";
import getCsvData from "../utils/csv";
import DownloadMap from "../utils/downloadmap";

export default function MyFriendsMap() {
  // get the authenticated user
  const { authUser } = useAuth();

  // create state variables
  const [others, setOthers] = useState([]);
  const [friends, setFriends] = useState([]);

  const handleAddFriend = async (friend) => {
    // get cookie value for authentication token
    const authToken = Cookies.get("authToken");
    try {
      await axios.post(
        `${serverURL}/friends/add`,
        {
          id: friend._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setFriends((prev) => [...prev, friend]);
      const newOthers = others.filter((others) => others._id !== friend?._id);
      setOthers(newOthers);

      toast.success(
        `You have added ${friend.username} as friend! Check map above to see them.`
      );
    } catch (error) {
      const responseError = error?.response?.data?.message;
      toast.error(responseError || error.message);
    }
  };

  const getMarkerIcon = (friendImage) =>
    new Leaflet.Icon({
      iconUrl: friendImage,
      iconSize: [38, 38],
    });

  useEffect(() => {
    // get authenticated user's friends
    const fetchedFriends = authUser?.friends || [];

    // get cookie value for authentication token
    const authToken = Cookies.get("authToken");

    // update friends state
    const initializeFriends = () => {
      setFriends(fetchedFriends);
    };

    // get other users or suggested users
    const getOtherUsers = async () => {
      try {
        const {
          data: { data },
        } = await axios.get(`${serverURL}/friends/others`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setOthers(data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    initializeFriends();
    getOtherUsers();
  }, [authUser]);

  return (
    <div className="text-black dark:text-white p-3 lg:p-10">
      <div className="flex h-screen flex-col justify-center space-y-10">
        <div className="h-1/2">
          <p className="my-3 lg:my-7">Your friends and their locations</p>
          <div className="relative">
            <div className="absolute z-50 right-0 flex">
              <button
                type="button"
                onClick={() => {
                  getCsvData("friends");
                }}
              >
                <FaFileCsv size={24} />
              </button>
            </div>
            <MapContainer
              id="friendsMap"
              placeholder
              center={[6.5244, 3.3792]}
              zoom={1}
              scrollWheelZoom={false}
              className="h-[300px] bg-black w-auto z-40 leaflet-container"
            >
              <DownloadMap
                position="topleft"
                sizeModes={["Current", "A4Portrait", "A4Landscape"]}
                hideControlContainer={false}
                title="Export as PNG"
                exportOnly
              />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {friends?.length > 0
                ? friends?.map((friend) => (
                    <Marker
                      key={friend?.id}
                      className="text-white dark:bg-red-500 leaflet-marker"
                      position={[
                        friend?.currentLocation?.latitude | "",
                        friend?.currentLocation?.longitude | "",
                      ]}
                      icon={getMarkerIcon(friend?.profileBanner)}
                    >
                      <Popup className="">
                        <div className="flex flex-col w-full">
                          <div>
                            <span className="font-bold text-primary-500">
                              Name:{" "}
                            </span>
                            <span>{friend?.username}</span>
                          </div>
                          <div>
                            <span className="font-bold text-primary-500">
                              current location:
                            </span>{" "}
                            <span>{friend?.currentLocation?.name}</span>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))
                : null}
            </MapContainer>
          </div>
        </div>
        <div className="h-1/2">
          <p className="my-3 lg:my-7">People that you may know</p>
          <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {others?.length > 0
              ? others?.map((user) => (
                  <div
                    key={user?._id}
                    id={`friend-${user?._id}`}
                    className="group h-48 w-full  relative z-10 rounded-2xl shadow-lg dark:shadow-black bg-[#f6f6f9]rounded-2xl dark:bg-gray-700 transition-all duration-1000"
                  >
                    <div className="group-hover:scale-105 group-hover:bg-[rgb(246,246,249)] bg-[#f6f6f9] dark:bg-gray-700 dark:group-hover:bg-gray-700 rounded-2xl absolute h-48 w-full z-20 transition-all duration-300 p-3 flex flex-col space-y-3" />
                    <div className=" h-48 w-full  relative z-20 p-3 rounded-2xl ">
                      <div className="flex h-full flex-col justify-between relative z-40 w-full">
                        <div className="h-3/4 flex flex-col ">
                          <Link
                            to={`${window.location.origin}/profile/${user?.username}`}
                            className="flex items-center"
                          >
                            <div>
                              <img
                                className="w-10 h-10 rounded-full"
                                src={user?.profileBanner}
                                alt="profile"
                              />
                            </div>
                            <span className="ml-3  bg-gray-400 text-white py-1 px-2 rounded text-xs">
                              {user?.username}
                            </span>
                          </Link>
                          <div className="text-xs mt-2">
                            <span className="text-primary-500">
                              current location:
                            </span>
                            <span className="ml-3">
                              {user?.currentLocation?.name}
                            </span>
                          </div>
                        </div>
                        <div className="h-1/4 flex flex-col justify-end">
                          <div className="flex justify-between items-center">
                            <div className="flex space-x-5 text-xs">
                              <div className="flex items-center space-x-1">
                                <FaLocationDot className=" text-primary-500" />
                                <span>{user?.locations?.length}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <CiUser className=" text-primary-500" />
                                <span>{user?.friends?.length}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                handleAddFriend(user);
                              }}
                              className="primary-button p-2 text-xs rounded-md flex items-center space-x-2 border border-primary-500 cursor-pointer"
                            >
                              <FaUserCheck /> <span>add friend</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}
