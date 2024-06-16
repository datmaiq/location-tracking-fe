import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Leaflet from "leaflet";
import useAuth from "../hooks/useAuth";
import serverURL from "../utils/urls";
import Loader from "../components/Loader";

export default function UserLocation() {
  // get the username from request parameters
  const { username } = useParams();

  // create the state variables
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // invoke the custom authentication hook
  useAuth();

  // create custom marker
  const markerIcon = new Leaflet.Icon({
    iconUrl: userDetails?.profileBanner,
    iconSize: [40, 40],
  });

  useEffect(() => {
    // create the getUser function
    const getUser = async () => {
      try {
        // get result data from request
        const {
          data: { data },
        } = await axios.get(`${serverURL}/locations/user/${username}`);

        // update states
        setUserDetails(data);
        setLoading(false);
      } catch (error) {
        const responseError = error?.response?.data?.message;
        toast.error(responseError || error.message);
        setLoading(false);
      }
    };

    // invoke the getUser() function
    getUser();
  }, [username]);

  return (
    <div className="p-3 h-screen lg:p-10 py-10 dark:text-white border mt-10">
      {loading ? (
        <Loader />
      ) : userDetails ? (
        <div className="h-screen w-full  flex flex-col ">
          <div className="h-1/6">
            <p className="my-3">
              This user has{" "}
              <span className="text-primary-500">
                {userDetails?.friends?.length}
              </span>{" "}
              friends
            </p>
            <p>
              And has visited{" "}
              <span className="text-primary-500">
                {userDetails?.locations?.length}
              </span>{" "}
              place(s).
            </p>
          </div>
          <div className="h-5/6">
            <MapContainer
              placeholder
              center={[6.5244, 3.3792]}
              zoom={3}
              scrollWheelZoom
              className=" bg-black h-3/4  leaflet-container"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                key={userDetails?._id}
                className="text-white dark:bg-red-500 leaflet-marker"
                position={[
                  userDetails?.currentLocation?.latitude,
                  userDetails?.currentLocation?.longitude,
                ]}
                icon={markerIcon}
              >
                <Popup className="">
                  <div className="flex flex-col w-full">
                    <div>
                      <span className="font-bold text-primary-500">Name: </span>
                      <span>{userDetails?.username}</span>
                    </div>
                    <div>
                      <span className="text-primary-500">current location:</span>{" "}
                      <span>{userDetails?.currentLocation?.name}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      ) : (
        <div>User details not available</div>
      )}
    </div>
  );
}