"use client";
import React, { useEffect, useState } from "react";
import Map, {
  Marker,
  NavigationControl,
  GeolocateControl,
  Popup,
} from "react-map-gl";
import { MapPin } from "lucide-react";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function NearMeModal({ open, onClose }) {
  const [userLocation, setUserLocation] = useState(null);
  const [stores, setStores] = useState([]);
  const [mapError, setMapError] = useState(false);
  const [popupInfo, setPopupInfo] = useState(null);

  useEffect(() => {
    if (open) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const coords = {
              longitude: pos.coords.longitude,
              latitude: pos.coords.latitude,
            };
            setUserLocation(coords);
            fetch(
              `/api/admin/nearby-stores?lng=${coords.longitude}&lat=${coords.latitude}`
            )
              .then((res) => res.json())
              .then((data) => {
                setStores(data.stores || []);
                console.log("Fetched stores:", data.stores);
              });
          },
          () => setMapError(true),
          { enableHighAccuracy: true }
        );
      } else {
        setMapError(true);
      }
    }
  }, [open]);

  // Fallback to default location if userLocation is not available
  const mapCenter = userLocation || { longitude: 67.0011, latitude: 24.8607 };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backdropFilter: "blur(6px)",
        background: "rgba(255,255,255,0.4)",
      }}
    >
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-[#C9AF2F]">
          Stores Near You
        </h2>
        <div className="h-96 w-full rounded overflow-hidden border-2 border-[#C9AF2F]">
          {mapError ? (
            <div className="w-full h-full flex items-center justify-center text-red-500">
              Unable to access your location or load the map.
            </div>
          ) : stores.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No stores found near your location.
            </div>
          ) : (
            <Map
              initialViewState={{
                longitude: mapCenter.longitude,
                latitude: mapCenter.latitude,
                zoom: 12,
              }}
              style={{ width: "100%", height: "100%" }}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              mapboxAccessToken={MAPBOX_TOKEN}
              attributionControl={false}
            >
              <NavigationControl position="top-right" />
              <GeolocateControl
                position="top-right"
                positionOptions={{ enableHighAccuracy: true }}
                trackUserLocation={true}
                auto={false}
              />
              {userLocation && (
                <Marker
                  longitude={userLocation.longitude}
                  latitude={userLocation.latitude}
                  anchor="bottom"
                >
                  <MapPin size={36} className="text-blue-600" />
                </Marker>
              )}
              {stores
                .filter(
                  (store) =>
                    store.location &&
                    store.location.coordinates &&
                    Array.isArray(store.location.coordinates.coordinates) &&
                    store.location.coordinates.coordinates.length === 2
                )
                .map((store) => (
                  <Marker
                    key={store._id}
                    longitude={store.location.coordinates.coordinates[0]}
                    latitude={store.location.coordinates.coordinates[1]}
                    anchor="bottom"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <MapPin
                        size={36}
                        className="text-red-600 drop-shadow-lg cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPopupInfo(store);
                        }}
                      />
                      <span
                        style={{
                          background: "rgba(255,255,255,0.85)",
                          color: "#C9AF2F",
                          fontWeight: 600,
                          fontSize: 12,
                          borderRadius: 4,
                          padding: "2px 6px",
                          marginTop: 2,
                          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                        }}
                      >
                        {store.name}
                      </span>
                    </div>
                  </Marker>
                ))}
              {popupInfo && (
                <Popup
                  longitude={popupInfo.location.coordinates.coordinates[0]}
                  latitude={popupInfo.location.coordinates.coordinates[1]}
                  anchor="top"
                  onClose={() => setPopupInfo(null)}
                  closeOnClick={false}
                >
                  <div>
                    <div className="font-bold text-[#C9AF2F]">
                      {popupInfo.name}
                    </div>
                    <div className="text-xs text-gray-700">
                      {popupInfo.address}
                    </div>
                  </div>
                </Popup>
              )}
            </Map>
          )}
        </div>
        <div className="mt-4">
          <ul>
            {stores.map((store) => (
              <li key={store._id} className="mb-2">
                <span className="font-semibold text-[#C9AF2F]">
                  {store.name}
                </span>{" "}
                - {store.address}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
