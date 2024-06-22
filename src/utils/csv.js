import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import serverURL from "./urls";

const getCsvData = async (dataType) => {
  const authToken = Cookies.get("authToken");

  if (!authToken) {
    toast.error("Please login!");
    return;
  }

  try {
    const response = await axios.get(`${serverURL}/${dataType}/csv-data`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      responseType: "blob",
    });

    if (response.status >= 200 && response.status < 300) {
      const blob = new Blob([response.data], { type: "text/csv" });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${dataType}.csv`;
      document.body.appendChild(a);

      a.click();

      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    } else {
      toast.error("An unexpected error occurred");
    }
  } catch (error) {
    toast.error(error.message);
  }
};

export default getCsvData;
