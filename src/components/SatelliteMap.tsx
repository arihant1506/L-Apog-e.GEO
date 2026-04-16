import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export interface SatelliteMapProps {
  latitude: number;
  longitude: number;
  date: string;
  zoom?: number;
  showRiskHeatmap?: boolean;
  timeComparisonDate?: string;
  comparisonSliderRatio?: number;
}

const MapUpdater = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const SatelliteMap: React.FC<SatelliteMapProps> = ({
  latitude,
  longitude,
  date,
  zoom = 9,
  showRiskHeatmap = false,
  timeComparisonDate,
  comparisonSliderRatio = 50
}) => {
  const position: [number, number] = [latitude, longitude];
  
  // NASA GIBS layer
  const GIBS_URL = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${date}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;
  const COMP_URL = timeComparisonDate ? `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${timeComparisonDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg` : GIBS_URL;
  
  // High-res fallback layer (Esri)
  const ESRI_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

  return (
    <div className="w-full h-[500px] rounded-lg shadow-md overflow-hidden bg-[#050505] border border-zinc-800 relative select-none">
      
      {/* Primary Map Layer (Right Side/Current) */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          key="primary-map"
          center={position}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          attributionControl={false}
        >
          {/* Base world imagery */}
          <TileLayer url={ESRI_URL} maxZoom={18} />
          {/* NASA Overlay */}
          <TileLayer key={date + 'primary'} url={GIBS_URL} maxZoom={9} minZoom={1} opacity={0.65} />
          <Marker position={position} />
          <MapUpdater center={position} zoom={zoom} />
        </MapContainer>
      </div>

      {/* Historical Overlay Map (Left Side) */}
      {timeComparisonDate && (
        <div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{ clipPath: `polygon(0 0, ${comparisonSliderRatio}% 0, ${comparisonSliderRatio}% 100%, 0 100%)` }}
        >
          <MapContainer
            key="secondary-map"
            center={position}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
            dragging={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            attributionControl={false}
          >
            {/* Base world imagery but heavily filtered to look 'historical' */}
            <TileLayer
              key={timeComparisonDate + 'secondary_esri'}
              url={ESRI_URL}
              maxZoom={18}
              className="grayscale brightness-110 contrast-125 sepia-[.3]" 
            />
            {/* NASA Overlay Historical */}
            <TileLayer
              key={timeComparisonDate + 'secondary_nasa'}
              url={COMP_URL}
              maxZoom={9}
              minZoom={1}
              opacity={0.7}
              className="grayscale brightness-110 contrast-125 sepia-[.3]" 
            />
            <Marker position={position} />
            <MapUpdater center={position} zoom={zoom} />
          </MapContainer>
        </div>
      )}
      
      {/* Date Labels */}
      {timeComparisonDate && (
        <>
          <div className="absolute top-4 left-4 bg-zinc-950/80 text-emerald-400 font-mono text-[10px] px-2 py-1 rounded border border-emerald-500/20 backdrop-blur pointer-events-auto z-20">HISTORICAL: {timeComparisonDate}</div>
          <div className="absolute top-4 right-4 bg-zinc-950/80 text-blue-400 font-mono text-[10px] px-2 py-1 rounded border border-blue-500/20 backdrop-blur z-20">CURRENT: {date}</div>
        </>
      )}

      {/* Heatmap Overlay Simulation */}
      {showRiskHeatmap && (
        <div className="absolute inset-0 z-[500] pointer-events-none flex items-center justify-center mix-blend-screen opacity-70">
           <div className="w-[150px] h-[150px] rounded-full bg-red-600 blur-[40px] absolute"></div>
           <div className="w-[80px] h-[80px] rounded-full bg-amber-400 blur-[25px] absolute ml-10 mt-10"></div>
        </div>
      )}
    </div>
  );
};

export default SatelliteMap;
