import {MapContainer, TileLayer} from 'react-leaflet';

const center = [6.5244, 3.3792];
const zoom = 13;

export default function MapComponent() {
  return (<div className="w-full overflow-hidden relative z-0 h-screen">
    <MapContainer placeholder center={center} zoom={zoom} scrollWheelZoom={false}
                  className="h-[90%] w-auto leaflet-container">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  </div>);
}