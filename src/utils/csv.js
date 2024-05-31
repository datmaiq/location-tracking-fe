import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import serverURL from "./urls";

const getCsvData = async (dataType) => {
  // get the authentication token from cookies
  const authToken = Cookies.get("authToken");

  // check if the authentication token is missing; if so, display an error toast and return
  if (!authToken) {
    toast.error("Please login!");
    return;
  }

  try {
    // make an asynchronous GET request to fetch CSV data based on the specified dataType
    const response = await axios.get(`${serverURL}/${dataType}/csv-data`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      responseType: "blob", // Set the response type to blob
    });

    // check if the HTTP status code indicates success (between 200 and 299)
    if (response.status >= 200 && response.status < 300) {
      // create a Blob from the response data with a type of 'text/csv'
      const blob = new Blob([response.data], { type: "text/csv" });

      // create a URL for the Blob and an anchor element (a) to trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${dataType}.csv`; // Set the download filename
      document.body.appendChild(a);

      // simulate a click on the anchor element to trigger the download
      a.click();

      // remove the anchor element from the document body
      document.body.removeChild(a);

      // revoke the URL to free up system resources
      window.URL.revokeObjectURL(url);
    } else {
      // display an error toast if the HTTP status code indicates an unexpected error
      toast.error("An unexpected error occurred");
    }
  } catch (error) {
    // handle errors by displaying an error toast with the error message
    toast.error(error.message);
  }
};

export default getCsvData;