import { useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import EditLocationModal from '../components/EditLocationModal';
import MyLocationsDetails from '../components/MyLocationsDetails';
import serverURL from '../utils/urls';

export default function MyLocations() {
  // create the state variables
  const [open, setOpen] = useState(false);
  const [locationId, setLocationId] = useState("");
  const [newLocationName, setNewLocationName] = useState("");
  const [initialLocationName, setInitialLocationName] = useState("")

  // close modal
  const handleCloseModal = () => {
    setOpen(false);
  };

  // handle the selection of a location for an update
  const handleSelectLocationForUpdate = (location) => {
    setOpen(true);
    setLocationId(location._id);
    setNewLocationName(location.name);
    setInitialLocationName(location.name);
  };

  // handle change of location name of form input
  const handleInputChange = (e) => {
    setNewLocationName(e.target.value);
  };

  // handle the location update by sending a request to server
  const handleLocationUpdate = async (e) => {
    e.preventDefault();
    const authToken = Cookies.get("authToken");

    try {
      const { data } = await axios.put(
        `${serverURL}/locations/edit`,
        {
          id: locationId,
          name: newLocationName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      toast.success(data.message);

      //reload page
      window.location.reload(true);
    } catch (error) {
      // display error upon unsuccessful request
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