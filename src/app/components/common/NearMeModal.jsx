"use client";
import React, { useEffect, useState } from "react";
import Map, {
  Marker,
  NavigationControl,
  GeolocateControl,
  Popup,
} from "react-map-gl";
import { MapPin, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function NearMeModal({ open, onClose }) {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState(null);
  const [stores, setStores] = useState([]);
  const [mapError, setMapError] = useState(false);
  const [popupInfo, setPopupInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setIsLoading(true);
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
                setIsLoading(false);
              })
              .catch((err) => {
                console.error("Failed to fetch stores:", err);
                setMapError(true);
                setIsLoading(false);
              });
          },
          () => {
            setMapError(true);
            setIsLoading(false);
          },
          { enableHighAccuracy: true }
        );
      } else {
        setMapError(true);
        setIsLoading(false);
      }
    }
  }, [open]);

  // Fallback to default location if userLocation is not available
  const mapCenter = userLocation || { longitude: 67.0011, latitude: 24.8607 };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
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
        </h2>{" "}
        <div className="h-96 w-full rounded overflow-hidden border-2 border-[#C9AF2F]">
          {isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#C9AF2F]">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p>Finding stores near you...</p>
            </div>
          ) : mapError ? (
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
              )}{" "}
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
                          maxWidth: "120px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {store.name}
                      </span>
                    </div>
                  </Marker>
                ))}{" "}
              {popupInfo && (
                <Popup
                  longitude={popupInfo.location.coordinates.coordinates[0]}
                  latitude={popupInfo.location.coordinates.coordinates[1]}
                  anchor="top"
                  onClose={() => setPopupInfo(null)}
                  closeOnClick={false}
                  maxWidth="300px"
                >
                  <div
                    className="cursor-pointer hover:bg-gray-50 p-2 -m-1 rounded"
                    onClick={() => {
                      const profileId = popupInfo.owner;
                      router.push(`/business-profile/${profileId}`);
                      onClose();
                    }}
                  >
                    <div className="font-bold text-[#C9AF2F]">
                      {popupInfo.name}
                    </div>
                    <div className="text-xs text-gray-700">
                      {popupInfo.address}
                    </div>
                    <div className="text-xs text-blue-600 mt-1 font-semibold">
                      Click to view profile
                    </div>
                  </div>
                </Popup>
              )}
            </Map>
          )}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
              <Loader2 className="animate-spin text-[#C9AF2F]" size={24} />
            </div>
          )}
        </div>{" "}
        <div className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-[#C9AF2F]" />
              <span className="ml-2">Loading nearby stores...</span>
            </div>
          ) : stores.length === 0 ? (
            <div className="text-center py-3 text-gray-500">
              No stores found in your area
            </div>
          ) : (
            <ul className="max-h-60 overflow-y-auto">
              {stores.map((store) => {
                const profileId = store.owner;

                return (
                  <li
                    key={store._id}
                    className="mb-2 p-2 rounded hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                    onClick={() => {
                      router.push(`/business-profile/${profileId}`);
                      onClose();
                    }}
                  >
                    <div>
                      <span className="font-semibold text-[#C9AF2F]">
                        {store.name}
                      </span>{" "}
                      <span className="text-sm text-gray-600">
                        - {store.address || "No address provided"}
                      </span>
                    </div>
                    <button className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded">
                      View Profile
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
