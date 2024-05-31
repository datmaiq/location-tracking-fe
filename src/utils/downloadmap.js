import { useEffect } from "react";
import L from "leaflet";
import "leaflet-easyprint";
import { useMap } from "react-leaflet";

function DownloadMap(props) {
  // access the map instance using the useMap hook
  const map = useMap();

  // the useEffect hook is used to perform side effects (such as adding/removing controls) after the component mounts
  useEffect(() => {
    // create an easyPrint control using the Leaflet's L.easyPrint method
    const control = L.easyPrint({
      ...props, // Pass props to the easyPrint control configuration
    });

    // add the easyPrint control to the Leaflet map
    map.addControl(control);

    // the Cleanup function to remove the control when the component is unmounted
    return () => {
      map.removeControl(control);
    };
  }, [map, props]); // The effect depends on changes in the map and props

  // the component doesn't render anything (returns null)
  return null;
}
export default DownloadMap;