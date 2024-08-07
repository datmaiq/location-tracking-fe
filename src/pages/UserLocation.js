import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import Leaflet from "leaflet";
import useAuth from "../hooks/useAuth";
import { serverURL } from "../utils/urls";
import Loader from "../components/Loader";

export default function UserLocation() {
  const { username } = useParams();

  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useAuth();

  const markerIcon = new Leaflet.Icon({
    iconUrl: userDetails?.profileBanner,
    iconSize: [40, 40],
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`${serverURL}/users/${username}`);

        setUserDetails(response.data);
        setLoading(false);
      } catch (error) {
        const responseError = error?.response?.data?.message;
        toast.error(responseError || error.message);
        setLoading(false);
      }
    };

    getUser();
  }, [username]);

  const isValidLocation =
    userDetails?.currentLocation?.latitude !== undefined &&
    userDetails?.currentLocation?.longitude !== undefined &&
    userDetails?.currentLocation?.latitude !== null &&
    userDetails?.currentLocation?.longitude !== null;

  function ZoomToMarker({ position }) {
    const map = useMap();

    useEffect(() => {
      if (position) {
        map.setView(position, 13);
      }
    }, [position, map]);

    return null;
  }

  return (
    <div className="p-3 h-screen lg:p-10 py-10 dark:text-white border mt-10">
      {loading ? (
        <Loader />
      ) : userDetails ? (
        <div className="h-screen w-full flex flex-col">
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
              className="bg-black h-3/4 leaflet-container"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {isValidLocation && (
                <>
                  <Marker
                    key={userDetails?._id}
                    className="text-white dark:bg-red-500 leaflet-marker"
                    position={[
                      userDetails.currentLocation.latitude,
                      userDetails.currentLocation.longitude,
                    ]}
                    icon={markerIcon}
                  >
                    <Popup>
                      <div className="flex flex-col w-full">
                        <div>
                          <span className="font-bold text-primary-500">
                            Name:{" "}
                          </span>
                          <span>{userDetails?.username}</span>
                        </div>
                        <div>
                          <span className="text-primary-500">
                            Current location:
                          </span>{" "}
                          <span>{userDetails?.currentLocation?.name}</span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                  <ZoomToMarker
                    position={[
                      userDetails.currentLocation.latitude,
                      userDetails.currentLocation.longitude,
                    ]}
                  />
                </>
              )}
            </MapContainer>
          </div>
        </div>
      ) : (
        <div>User details not available</div>
      )}
    </div>
  );
}
