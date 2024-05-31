import Autocomplete from "../components/Autocomplete";
import MapComponent from "../components/MapComponent";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import serverURL from "../utils/urls";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AppContext from "../utils/AppContext";

export default function AddLocation() {
  useAuth();

  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AppContext);

  const handleAddLocation = async (name, latitude, longitude) => {
    const authToken = Cookies.get("authToken");

    if (!isLoggedIn) {
      toast.error("Please login to add a new location!");
      return;
    }
    try {
      const { data } = await axios.post(
        `${serverURL}/locations/add`,
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
        },
      );
      toast.success(data.message);
      navigate("/my-locations");
    } catch (error) {
      const responseError = error?.response?.data?.message;
      toast.error(responseError || error.message);
    }
  };

  return (
    <div className="">
      <div className="h-screen  overflow-hidden left-0 fixed w-full">
        <div className="fixed lg:absolute w-full mt-20  z-40 flex flex-col justify-center items-center">
          <div className="w-[400px]">
            <Autocomplete onAddLocation={handleAddLocation} />
          </div>
        </div>
        <div className="absoulte top-0 h-full">
          <MapComponent />
        </div>
      </div>
    </div>
  );
}