"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Map, {
  Marker,
  NavigationControl,
  GeolocateControl,
  Popup,
  Layer,
  Source,
} from "react-map-gl";
import { 
  MapPin, 
  Loader2, 
  Navigation, 
  RefreshCw, 
  Store, 
  Clock,
  Eye,
  EyeOff,
  Settings
} from "lucide-react";
import { useRouter } from "next/navigation";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

/**
 * Enhanced NearMeModal Component with Real-time Features
 * 
 * New Features:
 * ✅ Real-time location tracking with live updates
 * ✅ Adjustable search radius (1km - 25km)
 * ✅ Enhanced store visibility with distance indicators
 * ✅ Auto-refresh every 2 minutes
 * ✅ Manual refresh functionality
 * ✅ Location accuracy display
 * ✅ Visual search radius circle on map
 * ✅ Improved store filtering and sorting by distance
 * ✅ Better error handling and fallback mechanisms
 * ✅ Mobile-responsive design
 * ✅ Enhanced popups with more store information
 * ✅ Performance optimizations with useCallback
 * ✅ Real-time status indicators
 * ✅ Smooth map animations and transitions
 * 
 * Technical Improvements:
 * - Uses Haversine formula for accurate distance calculations
 * - Implements geolocation watchPosition for real-time tracking
 * - Enhanced API with radius and limit parameters
 * - Better state management and cleanup
 * - Improved accessibility and user experience
 */

export default function NearMeModal({ open, onClose }) {
  const router = useRouter();
  const mapRef = useRef();
  const geolocateRef = useRef();
  const locationWatchRef = useRef();
  
  const [userLocation, setUserLocation] = useState(null);
  const [stores, setStores] = useState([]);
  const [mapError, setMapError] = useState(false);
  const [popupInfo, setPopupInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: 67.0011,
    latitude: 24.8607,
    zoom: 12,
  });
  const [searchRadius, setSearchRadius] = useState(5000); // 5km default
  const [showUserRadius, setShowUserRadius] = useState(true);
  const [realTimeTracking, setRealTimeTracking] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [locationAccuracy, setLocationAccuracy] = useState(null);

  // Enhanced location fetching with better accuracy
  const getCurrentLocation = useCallback((options = {}) => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      const defaultOptions = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000, // 1 minute cache
        ...options
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          setLocationAccuracy(position.coords.accuracy);
          resolve(coords);
        },
        (error) => {
          console.error('Geolocation error:', error);
          reject(error);
        },
        defaultOptions
      );
    });
  }, []);

  // Fetch nearby stores with enhanced filtering
  const fetchNearbyStores = useCallback(async (coords, radius = searchRadius) => {
    try {
      const response = await fetch(
        `/api/admin/nearby-stores?lng=${coords.longitude}&lat=${coords.latitude}&radius=${radius}&limit=50`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Filter and sort stores by distance
      const validStores = (data.stores || [])
        .filter(store => 
          store.location && 
          store.location.coordinates && 
          Array.isArray(store.location.coordinates.coordinates) &&
          store.location.coordinates.coordinates.length === 2 &&
          !isNaN(store.location.coordinates.coordinates[0]) &&
          !isNaN(store.location.coordinates.coordinates[1])
        )
        .map(store => {
          // Calculate distance from user
          const distance = calculateDistance(
            coords.latitude,
            coords.longitude,
            store.location.coordinates.coordinates[1],
            store.location.coordinates.coordinates[0]
          );
          return { ...store, distance };
        })
        .sort((a, b) => a.distance - b.distance);

      setStores(validStores);
      setLastUpdated(new Date());
      console.log(`Fetched ${validStores.length} nearby stores within ${radius}m`);
      
      return validStores;
    } catch (error) {
      console.error('Failed to fetch stores:', error);
      throw error;
    }
  }, [searchRadius]);

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  // Initialize location and stores
  const initializeLocation = useCallback(async () => {
    setIsLoading(true);
    setMapError(false);

    try {
      const coords = await getCurrentLocation();
      setUserLocation(coords);
      
      // Update map view to user location
      setViewState(prev => ({
        ...prev,
        longitude: coords.longitude,
        latitude: coords.latitude,
        zoom: 14
      }));

      await fetchNearbyStores(coords);
    } catch (error) {
      console.error('Failed to get location:', error);
      setMapError(true);
      
      // Fallback to default location (Karachi, Pakistan)
      const fallbackCoords = { longitude: 67.0011, latitude: 24.8607 };
      setUserLocation(fallbackCoords);
      await fetchNearbyStores(fallbackCoords);
    } finally {
      setIsLoading(false);
    }
  }, [getCurrentLocation, fetchNearbyStores]);

  // Refresh stores data
  const refreshStores = useCallback(async () => {
    if (!userLocation) return;
    
    setIsRefreshing(true);
    try {
      await fetchNearbyStores(userLocation);
    } catch (error) {
      console.error('Failed to refresh stores:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [userLocation, fetchNearbyStores]);

  // Real-time location tracking
  const startRealTimeTracking = useCallback(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const coords = {
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
        
        setUserLocation(coords);
        setLocationAccuracy(position.coords.accuracy);
        
        // Only fetch stores if location changed significantly (>100m)
        if (userLocation) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            coords.latitude,
            coords.longitude
          );
          
          if (distance > 100) { // 100 meters threshold
            fetchNearbyStores(coords);
          }
        }
      },
      (error) => {
        console.error('Real-time tracking error:', error);
        setRealTimeTracking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );

    locationWatchRef.current = watchId;
  }, [userLocation, fetchNearbyStores, calculateDistance]);

  // Stop real-time tracking
  const stopRealTimeTracking = useCallback(() => {
    if (locationWatchRef.current) {
      navigator.geolocation.clearWatch(locationWatchRef.current);
      locationWatchRef.current = null;
    }
  }, []);

  // Toggle real-time tracking
  const toggleRealTimeTracking = useCallback(() => {
    if (realTimeTracking) {
      stopRealTimeTracking();
      setRealTimeTracking(false);
    } else {
      startRealTimeTracking();
      setRealTimeTracking(true);
    }
  }, [realTimeTracking, startRealTimeTracking, stopRealTimeTracking]);

  // Initialize when modal opens
  useEffect(() => {
    if (open) {
      initializeLocation();
    } else {
      // Cleanup when modal closes
      stopRealTimeTracking();
      setStores([]);
      setPopupInfo(null);
      setMapError(false);
      setLastUpdated(null);
    }

    return () => {
      stopRealTimeTracking();
    };
  }, [open, initializeLocation, stopRealTimeTracking]);

  // Auto-refresh stores every 2 minutes when modal is open
  useEffect(() => {
    if (!open || !userLocation) return;

    const interval = setInterval(() => {
      if (!realTimeTracking) { // Don't auto-refresh if real-time tracking is active
        refreshStores();
      }
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, [open, userLocation, realTimeTracking, refreshStores]);

  // Format distance for display
  const formatDistance = (distance) => {
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    } else {
      return `${(distance / 1000).toFixed(1)}km`;
    }
  };

  // Format time since last update
  const formatTimeSince = (date) => {
    if (!date) return '';
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  // Create radius circle data for visualization
  const radiusCircleData = userLocation && showUserRadius ? {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [userLocation.longitude, userLocation.latitude]
    },
    properties: {
      radius: searchRadius
    }
  } : null;

  // Fallback to default location if userLocation is not available
  const mapCenter = userLocation || { longitude: 67.0011, latitude: 24.8607 };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm near-me-modal"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full h-[85vh] mx-4 overflow-hidden flex flex-col near-me-modal-content md:mx-8">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-[#C9AF2F] to-[#d2b33a]">
          <div className="flex items-center gap-2 md:gap-3">
            <Store className="text-white" size={20} />
            <h2 className="text-lg md:text-xl font-bold text-white">Stores Near You</h2>
            {stores.length > 0 && (
              <span className="bg-white/20 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                {stores.length} found
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Status indicators */}
            <div className="flex items-center gap-2 text-white text-sm">
              {realTimeTracking && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Live
                </div>
              )}
              {lastUpdated && (
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {formatTimeSince(lastUpdated)}
                </div>
              )}
              {locationAccuracy && (
                <div className="text-xs opacity-75">
                  ±{Math.round(locationAccuracy)}m
                </div>
              )}
            </div>
            
            <button
              className="text-white hover:text-gray-200 p-1"
              onClick={onClose}
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="p-3 md:p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            {/* Refresh button */}
            <button
              onClick={refreshStores}
              disabled={isRefreshing || isLoading}
              className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 bg-[#C9AF2F] text-white rounded-lg hover:bg-[#b89f28] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              <span className="sm:hidden">↻</span>
            </button>

            {/* Real-time tracking toggle */}
            <button
              onClick={toggleRealTimeTracking}
              className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 rounded-lg transition-colors text-sm ${
                realTimeTracking 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Navigation size={14} className={realTimeTracking ? 'animate-pulse' : ''} />
              <span className="hidden sm:inline">{realTimeTracking ? 'Stop Tracking' : 'Live Track'}</span>
              <span className="sm:hidden">{realTimeTracking ? '⏹' : '📍'}</span>
            </button>

            {/* Search radius selector */}
            <div className="flex items-center gap-1 md:gap-2">
              <label className="text-xs md:text-sm font-medium text-gray-700 hidden sm:inline">Radius:</label>
              <select
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className="px-2 md:px-3 py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-[#C9AF2F] focus:border-transparent"
              >
                <option value={1000}>1km</option>
                <option value={2000}>2km</option>
                <option value={5000}>5km</option>
                <option value={10000}>10km</option>
                <option value={25000}>25km</option>
              </select>
            </div>

            {/* Show radius toggle */}
            <button
              onClick={() => setShowUserRadius(!showUserRadius)}
              className={`flex items-center gap-1 px-2 md:px-3 py-2 rounded-lg text-xs md:text-sm transition-colors ${
                showUserRadius 
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {showUserRadius ? <Eye size={12} /> : <EyeOff size={12} />}
              <span className="hidden sm:inline">Range</span>
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          {isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#C9AF2F] bg-gray-50">
              <Loader2 className="h-12 w-12 animate-spin mb-4" />
              <p className="text-lg font-medium">Finding stores near you...</p>
              <p className="text-sm text-gray-600 mt-2">This may take a moment</p>
            </div>
          ) : mapError ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-red-500 bg-gray-50">
              <MapPin className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium">Unable to access your location</p>
              <p className="text-sm text-gray-600 mt-2">Please enable location services and try again</p>
              <button
                onClick={initializeLocation}
                className="mt-4 px-4 py-2 bg-[#C9AF2F] text-white rounded-lg hover:bg-[#b89f28] transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <Map
              ref={mapRef}
              {...viewState}
              onMove={evt => setViewState(evt.viewState)}
              style={{ width: "100%", height: "100%" }}
              mapStyle="mapbox://styles/mapbox/light-v11"
              mapboxAccessToken={MAPBOX_TOKEN}
              attributionControl={false}
              interactiveLayerIds={['stores-layer']}
            >
              <NavigationControl position="top-right" />
              <GeolocateControl
                ref={geolocateRef}
                position="top-right"
                positionOptions={{ enableHighAccuracy: true }}
                trackUserLocation={realTimeTracking}
                auto={false}
                onGeolocate={(e) => {
                  const coords = {
                    longitude: e.coords.longitude,
                    latitude: e.coords.latitude,
                    accuracy: e.coords.accuracy,
                    timestamp: Date.now()
                  };
                  setUserLocation(coords);
                  setLocationAccuracy(e.coords.accuracy);
                  fetchNearbyStores(coords);
                }}
              />

              {/* Search radius circle */}
              {radiusCircleData && showUserRadius && (
                <Source
                  id="radius-source"
                  type="geojson"
                  data={radiusCircleData}
                >
                  <Layer
                    id="radius-circle"
                    type="circle"
                    paint={{
                      'circle-radius': {
                        stops: [
                          [0, 0],
                          [20, searchRadius / 20]
                        ],
                        base: 2
                      },
                      'circle-color': '#C9AF2F',
                      'circle-opacity': 0.1,
                      'circle-stroke-color': '#C9AF2F',
                      'circle-stroke-width': 2,
                      'circle-stroke-opacity': 0.6
                    }}
                  />
                </Source>
              )}

              {/* User location marker */}
              {userLocation && (
                <Marker
                  longitude={userLocation.longitude}
                  latitude={userLocation.latitude}
                  anchor="center"
                >
                  <div className="relative">
                    <div className={`w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg ${realTimeTracking ? 'animate-pulse' : ''}`}></div>
                    {locationAccuracy && locationAccuracy < 50 && (
                      <div className="absolute -top-1 -left-1 w-6 h-6 bg-blue-400 rounded-full opacity-30 animate-ping"></div>
                    )}
                  </div>
                </Marker>
              )}

              {/* Store markers */}
              {stores.map((store) => (
                <Marker
                  key={store._id}
                  longitude={store.location.coordinates.coordinates[0]}
                  latitude={store.location.coordinates.coordinates[1]}
                  anchor="bottom"
                >
                  <div className="flex flex-col items-center cursor-pointer transform hover:scale-110 transition-transform">
                    <div className="relative">
                      <MapPin
                        size={32}
                        className="text-red-600 drop-shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPopupInfo(store);
                        }}
                      />
                      {/* Distance badge */}
                      <div className="absolute -top-2 -right-2 bg-white text-xs font-bold text-[#C9AF2F] border border-[#C9AF2F] rounded-full px-1 min-w-[20px] text-center">
                        {formatDistance(store.distance)}
                      </div>
                    </div>
                    <div className="bg-white/95 text-[#C9AF2F] font-semibold text-xs rounded px-2 py-1 mt-1 shadow-sm border max-w-[100px] truncate">
                      {store.name}
                    </div>
                  </div>
                </Marker>
              ))}

              {/* Enhanced popup */}
              {popupInfo && (
                <Popup
                  longitude={popupInfo.location.coordinates.coordinates[0]}
                  latitude={popupInfo.location.coordinates.coordinates[1]}
                  anchor="top"
                  onClose={() => setPopupInfo(null)}
                  closeOnClick={false}
                  maxWidth="320px"
                  className="rounded-lg overflow-hidden"
                >
                  <div
                    className="cursor-pointer hover:bg-gray-50 p-4 transition-colors"
                    onClick={() => {
                      const profileId = popupInfo.owner;
                      router.push(`/business-profile/${profileId}`);
                      onClose();
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-bold text-[#C9AF2F] text-lg">
                        {popupInfo.name}
                      </div>
                      <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                        {formatDistance(popupInfo.distance)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 mb-2">
                      📍 {popupInfo.address || "Address not provided"}
                    </div>
                    {popupInfo.phone && (
                      <div className="text-sm text-gray-600 mb-2">
                        📞 {popupInfo.phone}
                      </div>
                    )}
                    <div className="text-xs text-blue-600 font-semibold bg-blue-50 p-2 rounded">
                      👆 Click to view full business profile
                    </div>
                  </div>
                </Popup>
              )}
            </Map>
          )}
        </div>
        {/* Store List */}
        <div className="p-3 md:p-4 border-t border-gray-100 bg-gray-50 max-h-[200px] md:max-h-[250px] overflow-y-auto store-list-mobile">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-[#C9AF2F] mr-3" />
              <span className="text-gray-600 text-sm md:text-base">Loading nearby stores...</span>
            </div>
          ) : stores.length === 0 ? (
            <div className="text-center py-6">
              <Store className="h-8 md:h-12 w-8 md:w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium text-sm md:text-base">No stores found in your area</p>
              <p className="text-xs md:text-sm text-gray-400 mt-1">Try increasing the search radius</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                  Found {stores.length} stores nearby
                </h3>
                <button
                  onClick={() => {
                    if (mapRef.current && userLocation) {
                      mapRef.current.flyTo({
                        center: [userLocation.longitude, userLocation.latitude],
                        zoom: 14,
                        duration: 1000
                      });
                    }
                  }}
                  className="text-xs md:text-sm text-[#C9AF2F] hover:text-[#b89f28] font-medium"
                >
                  📍 Center on me
                </button>
              </div>
              
              {stores.map((store, index) => (
                <div
                  key={store._id}
                  className="bg-white rounded-lg p-2 md:p-3 hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 hover:border-[#C9AF2F] store-list-item"
                  onClick={() => {
                    const profileId = store.owner;
                    router.push(`/business-profile/${profileId}`);
                    onClose();
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-[#C9AF2F] text-sm md:text-lg truncate">
                          {store.name}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex-shrink-0">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="text-xs md:text-sm text-gray-600 mb-2 truncate">
                        📍 {store.address || "Address not provided"}
                      </div>
                      {store.phone && (
                        <div className="text-xs md:text-sm text-gray-500 mb-1 truncate">
                          📞 {store.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-2 md:gap-4 text-xs text-gray-500">
                        <span>🕒 {formatTimeSince(lastUpdated)}</span>
                        {store.category && (
                          <span className="hidden sm:inline">🏷️ {store.category}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-2">
                      <div className="bg-green-100 text-green-700 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                        {formatDistance(store.distance)}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (mapRef.current) {
                            mapRef.current.flyTo({
                              center: store.location.coordinates.coordinates,
                              zoom: 16,
                              duration: 1000
                            });
                            setPopupInfo(store);
                          }
                        }}
                        className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 md:px-3 py-1 rounded-full transition-colors whitespace-nowrap"
                      >
                        📍 <span className="hidden sm:inline">Show on </span>map
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
