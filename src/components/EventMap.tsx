import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  CircleMarker,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BellSimpleRingingIcon, ConfettiIcon } from "@phosphor-icons/react";

// Custom marker icon
const customIcon = L.icon({
  iconUrl: "/images/marker-ulos.png",
  iconSize: [50, 50],
  iconAnchor: [25, 40],
  popupAnchor: [0, -40],
});

type MarkerData = {
  position: [number, number];
  title: string;
  subTitle: string;
  autoOpen?: boolean;
  iconName?: string;
};

const ICONS: Record<string, React.ComponentType<any>> = {
  confetti: ConfettiIcon,
  ring: BellSimpleRingingIcon,
};

function FitToMarkers({ markers }: { markers: MarkerData[] }) {
  const map = useMap();
  useEffect(() => {
    if (!markers?.length) return;
    if (markers.length === 1) {
      map.setView(markers[0].position, 5, { animate: true });
      return;
    }
    const bounds = L.latLngBounds(markers.map((m) => m.position));
    map.fitBounds(bounds, { padding: [40, 40], animate: true });
  }, [markers, map]);
  return null;
}

function MarkerWithPopup({
  position,
  title,
  subTitle,
  autoOpen,
  iconName,
}: MarkerData) {
  const markerRef = useRef<L.Marker>(null);
  const map = useMap();
  useEffect(() => {
    if (autoOpen && markerRef.current) {
      // buka popup setelah map siap
      setTimeout(() => markerRef.current?.openPopup(), 0);
    }
  }, [autoOpen, map]);

  const IconComp = iconName ? ICONS[iconName.toLowerCase()] : null;

  return (
    <Marker position={position} ref={markerRef} icon={customIcon}>
      <CircleMarker
        center={position}
        radius={3}
        pathOptions={{ color: "red", weight: 2 }}
        interactive={false}
      />
      <Popup>
        <div className="flex items-center gap-1 font-body font-medium text-dark text-base">
          {IconComp ? <IconComp size={16} weight="bold" /> : null}
          {title}
        </div>
        <div className="text-gray-700 text-sm font-body">{subTitle}</div>
      </Popup>
    </Marker>
  );
}

interface PropTypes {
  markers: MarkerData[];
  zoom?: number; // fallback jika hanya 1 marker
}

export default function EventMap({ markers, zoom = 5 }: PropTypes) {
  const key = import.meta.env.PUBLIC_MAPTILER_KEY;
  const initialCenter = markers?.[0]?.position ?? [0, 0];

  return (
    <div className="w-full h-64 md:min-h-[400px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={initialCenter as [number, number]}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Base OSM */}
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>'
          zIndex={1}
        />
        {/* Overlays */}
        <TileLayer
          url={`https://api.maptiler.com/tiles/hillshade/{z}/{x}/{y}.png?key=${key}`}
          attribution='&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a>'
          opacity={0.45}
          zIndex={2}
        />
        <TileLayer
          url={`https://api.maptiler.com/tiles/contours/{z}/{x}/{y}.png?key=${key}`}
          attribution='&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a>'
          zIndex={3}
        />

        {/* Render all markers */}
        {markers?.map((m, i) => (
          <MarkerWithPopup key={`${m.position.join(",")}-${i}`} {...m} />
        ))}

        {/* Auto fit to all markers */}
        <FitToMarkers markers={markers} />
      </MapContainer>
    </div>
  );
}
