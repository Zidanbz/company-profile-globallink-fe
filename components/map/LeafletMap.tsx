"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapLocation, MapLocationCategory } from "@/types";
import { Badge } from "../base/Badge";
import { 
  Wifi, 
  Database, 
  Radio, 
  Building2, 
  Satellite, 
  ShieldCheck, 
  Navigation, 
  Layers,
  Sparkles
} from "lucide-react";

// Category Colors & Styling
const categoryConfig: Record<string, { color: string; label: string; bgGradient: string }> = {
  FIBER_OPTIC: {
    color: "#0055d4",
    label: "Fiber Optic Backbone",
    bgGradient: "from-blue-600 to-cyan-500",
  },
  DATA_CENTER: {
    color: "#06b6d4",
    label: "Tier-3 Data Center",
    bgGradient: "from-cyan-500 to-teal-500",
  },
  POP: {
    color: "#3b82f6",
    label: "Point of Presence (POP)",
    bgGradient: "from-blue-500 to-indigo-600",
  },
  OFFICE: {
    color: "#6366f1",
    label: "NOC & Head Office",
    bgGradient: "from-indigo-600 to-purple-600",
  },
  COVERAGE: {
    color: "#10b981",
    label: "SkyNet VSAT Terminal",
    bgGradient: "from-emerald-500 to-teal-600",
  },
  OTHER: {
    color: "#8b5cf6",
    label: "Infrastruktur Terintegrasi",
    bgGradient: "from-purple-600 to-pink-500",
  },
};

// Custom radar pulse icon generator
const createCustomMarker = (category: string) => {
  const config = categoryConfig[category] || categoryConfig.FIBER_OPTIC;
  return L.divIcon({
    className: "custom-glowing-marker",
    html: `
      <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
        <div style="
          position: absolute;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: ${config.color};
          opacity: 0.35;
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          position: relative;
          background: ${config.color};
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2.5px solid #ffffff;
          box-shadow: 0 0 10px ${config.color}, 0 2px 6px rgba(0,0,0,0.3);
        "></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

// Map controller for animated panning
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

export interface LeafletMapProps {
  locations: MapLocation[];
  selectedCategory?: string;
  activeLocation?: MapLocation | null;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  locations,
  selectedCategory,
  activeLocation,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[540px] rounded-3xl bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mb-3" />
        <span className="text-sm font-semibold tracking-wide text-cyan-400">
          Menyiapkan Peta Jaringan Interaktif...
        </span>
      </div>
    );
  }

  const filteredLocations = selectedCategory && selectedCategory !== "ALL"
    ? locations.filter((loc) => loc.category === selectedCategory)
    : locations;

  // Center of Indonesia
  const mapCenter: [number, number] = activeLocation
    ? [
        typeof activeLocation.latitude === "string" ? parseFloat(activeLocation.latitude) : activeLocation.latitude,
        typeof activeLocation.longitude === "string" ? parseFloat(activeLocation.longitude) : activeLocation.longitude,
      ]
    : [-2.5489, 118.0149];

  const mapZoom = activeLocation ? 8 : 5;

  return (
    <div className="w-full h-[540px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 relative z-0">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        {/* Clean OpenStreetMap free tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController center={mapCenter} zoom={mapZoom} />

        {filteredLocations.map((loc) => {
          const lat = typeof loc.latitude === "string" ? parseFloat(loc.latitude) : loc.latitude;
          const lng = typeof loc.longitude === "string" ? parseFloat(loc.longitude) : loc.longitude;

          if (isNaN(lat) || isNaN(lng)) return null;

          const config = categoryConfig[loc.category] || categoryConfig.FIBER_OPTIC;

          return (
            <Marker
              key={loc.id}
              position={[lat, lng]}
              icon={createCustomMarker(loc.category)}
            >
              <Popup className="custom-popup">
                <div className="p-2 space-y-2 text-left max-w-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {config.label}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-[#0a193b] leading-snug">
                    {loc.name}
                  </h4>

                  {loc.description && (
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {loc.description}
                    </p>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-500">
                    <span className="font-mono text-blue-600">
                      {lat.toFixed(4)}, {lng.toFixed(4)}
                    </span>
                    <span className="text-emerald-600">● 99.9% Active</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
