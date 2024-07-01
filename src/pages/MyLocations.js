import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import EditLocationModal from "../components/EditLocationModal";
import MyLocationsDetails from "../components/MyLocationsDetails";
import { serverURL } from "../utils/urls";

export default function MyLocations() {
  const [open, setOpen] = useState(false);
  const [locationId, setLocationId] = useState("");
  const [newLocationName, setNewLocationName] = useState("");
  const [initialLocationName, setInitialLocationName] = useState("");

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleSelectLocationForUpdate = (location) => {
    setOpen(true);
    setLocationId(location._id);
    setNewLocationName(location.name);
    setInitialLocationName(location.name);
  };

  const handleInputChange = (e) => {
    setNewLocationName(e.target.value);
  };

  const handleLocationUpdate = async (e) => {
    e.preventDefault();
    const authToken = Cookies.get("authToken");

    try {
      const { data } = await axios.put(
        `${serverURL}/locations/${locationId}`,
        {
          name: newLocationName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      toast.success(data.message);

      window.location.reload(true);
    } catch (error) {
      const responseError = error?.response?.data?.message;
      toast.error(responseError || error.message);
    }
  };

  return (
    <div className="">
      <div className="text-black dark:text-white lg:p-10">
        <EditLocationModal
          open={open}
          handleCloseModal={handleCloseModal}
          newLocationName={newLocationName}
          initialLocationName={initialLocationName}
          handleInputChange={handleInputChange}
          handleLocationUpdate={handleLocationUpdate}
        />
        <MyLocationsDetails
          handleSelectLocationForUpdate={handleSelectLocationForUpdate}
        />
      </div>
    </div>
  );
}
