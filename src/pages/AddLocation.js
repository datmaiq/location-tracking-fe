import React, { useState, useContext } from "react";
import Autocomplete from "../components/Autocomplete";
import MapComponent from "../components/MapComponent";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { serverURL, reverseGeocodeURL } from "../utils/urls";
import { useNavigate } from "react-router-dom";
import AppContext from "../utils/AppContext";

export default function AddLocation() {
  useAuth();

  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const handleAddLocation = async (name, latitude, longitude) => {
    const authToken = Cookies.get("authToken");

    if (!isLoggedIn) {
      toast.error("Please login to add a new location!");
      return;
    }
    try {
      const { data } = await axios.post(
        `${serverURL}/locations`,
        {
          name,
          latitude,
          longitude,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      toast.success(data.message);
      navigate("/my-locations");
    } catch (error) {
      const responseError = error?.response?.data?.message;
      toast.error(responseError || error.message);
      console.log(error);
    }
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const { data } = await axios.get(
        `${reverseGeocodeURL}&lat=${latitude}&lon=${longitude}`
      );
      return data.display_name;
    } catch (error) {
      console.error("Error in reverse geocoding: ", error);
      return "Current Location";
    }
  };

  const handleFetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log(position);
        const locationName = await reverseGeocode(latitude, longitude);
        handleAddLocation(locationName, latitude, longitude);
        setLoading(false);
      },
      (error) => {
        toast.error("Unable to retrieve your location");
        console.error(error);
        setLoading(false);
      }
    );
  };

  return (
    <div className="">
      <div className="h-screen  overflow-hidden left-0 fixed w-full">
        <div className="fixed lg:absolute w-full mt-20  z-40 flex flex-col justify-center items-center">
          <div className="w-[400px]">
            <Autocomplete
              onAddLocation={handleAddLocation}
              onFetchCurrentLocation={handleFetchCurrentLocation}
              showCurrentLocationButton={true}
              loading={loading}
            />
          </div>
        </div>
        <div className="absoulte top-0 h-full">
          <MapComponent />
        </div>
      </div>
    </div>
  );
}
