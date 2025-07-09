"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Navbar from "../components/common/Navbar";
import { sellerApplicationSchema } from "@/lib/validations";
import Link from "next/link";
import Map, { Marker, NavigationControl, GeolocateControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const SellerProfile = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapView, setMapView] = useState({
    longitude: 67.0011,
    latitude: 24.8607,
    zoom: 10,
    bearing: 0,
    pitch: 0,
  });
  const [serviceRadius, setServiceRadius] = useState(10);
  const [existingApplication, setExistingApplication] = useState(null);
  const [checkingApplication, setCheckingApplication] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [mapError, setMapError] = useState(false);
  const searchTimeout = useRef(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger,
    watch,
  } = useForm({
    resolver: zodResolver(sellerApplicationSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      toast.error("Please login to submit seller application");
      router.push("/log-in");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (!session?.user?.id) return;
    setCheckingApplication(true);
    axios
      .get("/api/seller/my-application")
      .then((res) => {
        if (res.data.success && res.data.application) {
          setExistingApplication(res.data.application);
        } else {
          setExistingApplication(null);
        }
      })
      .catch(() => setExistingApplication(null))
      .finally(() => setCheckingApplication(false));
  }, [session?.user?.id]);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            searchQuery
          )}.json?access_token=${MAPBOX_TOKEN}&country=PK`
        );
        setSearchResults(res.data.features || []);
      } catch {
        setSearchResults([]);
      }
    }, 400);
  }, [searchQuery]);

  const handleSelectPlace = (feature) => {
    setSelectedLocation({
      address: feature.place_name,
      coordinates: {
        type: "Point",
        coordinates: feature.center,
      },
      placeId: feature.id,
      formattedAddress: feature.place_name,
      addressComponents: {},
      viewport: feature.bbox
        ? {
            northeast: {
              lat: feature.bbox[3],
              lng: feature.bbox[2],
            },
            southwest: {
              lat: feature.bbox[1],
              lng: feature.bbox[0],
            },
          }
        : null,
    });
    setMapView({
      longitude: feature.center[0],
      latitude: feature.center[1],
      zoom: 15,
      bearing: 0,
      pitch: 0,
    });
    setSearchResults([]);
    setSearchQuery(feature.place_name);
    toast.success("Location selected successfully!");
  };

  const handleLocationInputChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedLocation(null);
  };

  const handleMapClick = async (evt) => {
    const { lngLat } = evt;
    const longitude = lngLat.lng;
    const latitude = lngLat.lat;

    try {
      const res = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}&country=PK`
      );

      const features = res.data.features || [];
      if (features.length > 0) {
        const feature = features[0];
        setSelectedLocation({
          address: feature.place_name,
          coordinates: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          placeId: feature.id,
          formattedAddress: feature.place_name,
          addressComponents: {},
          viewport: feature.bbox
            ? {
                northeast: {
                  lat: feature.bbox[3],
                  lng: feature.bbox[2],
                },
                southwest: {
                  lat: feature.bbox[1],
                  lng: feature.bbox[0],
                },
              }
            : null,
        });

        setMapView({
          longitude,
          latitude,
          zoom: 15,
          bearing: 0,
          pitch: 0,
        });

        setSearchQuery(feature.place_name);
        toast.success("Location selected from map!");
      } else {
        toast.error("Could not find address for this location");
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      toast.error("Failed to get address for this location");
    }
  };

  const onSubmit = async (data) => {
    if (!session) {
      toast.error("Please login to submit application");
      return;
    }

    if (!selectedLocation) {
      toast.error("Please select a valid location from the suggestions");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("location", JSON.stringify(selectedLocation));
      formData.append("serviceRadius", serviceRadius.toString());
      Object.keys(data).forEach((key) => {
        if (key !== "location" && data[key]) {
          formData.append(key, data[key]);
        }
      });
      const response = await axios.post("/api/seller/apply", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true,
        timeout: 60000,
      });

      if (response.status === 201) {
        toast.success(
          "Application submitted successfully! We'll review it soon.",
          {
            description: "You'll receive an email notification once reviewed.",
            duration: 5000,
          }
        );
        reset();
        setSelectedLocation(null);
        router.push("/dashboard/seller");
      }
    } catch (error) {
      console.error("Application submission error:", error);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        router.push("/log-in");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Invalid application data");
      } else if (error.response?.status === 409) {
        toast.warning("You already have a pending application", {
          description:
            "Please wait for the current application to be reviewed.",
        });
      } else if (error.code === "ECONNABORTED") {
        toast.error("Request timeout. Please try again.");
      } else {
        toast.error("Failed to submit application", {
          description: "Please check your connection and try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || checkingApplication) {
    return (
      <>
        <Navbar />
        <main className="bg-gray-100 py-10 px-4 min-h-screen">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9AF2F]"></div>
          </div>
        </main>
      </>
    );
  }

  if (existingApplication) {
    const { status, adminNotes, reason } = existingApplication;
    return (
      <>
        <Navbar />
        <main className="bg-gray-100 py-10 px-4 min-h-screen flex flex-col items-center justify-center">
          <div className="bg-white shadow-xl rounded-xl p-8 max-w-2xl w-full text-center space-y-6">
            {status === "pending" && (
              <>
                <h2 className="text-2xl font-bold text-[#C9AF2F] mb-2">
                  Application Pending
                </h2>
                <p className="text-gray-700">
                  Your seller application is under review. You will be notified
                  once the admin reviews your application.
                </p>
                {adminNotes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mt-4 text-yellow-800">
                    <strong>Admin Note:</strong>
                    <div>{adminNotes}</div>
                  </div>
                )}
              </>
            )}
            {status === "rejected" && (
              <>
                <h2 className="text-2xl font-bold text-red-600 mb-2">
                  Application Rejected
                </h2>
                <p className="text-gray-700">
                  Unfortunately, your seller application was rejected.
                </p>
                {(adminNotes || reason) && (
                  <div className="bg-red-50 border border-red-200 rounded p-4 mt-4 text-red-800">
                    <strong>Admin Note:</strong>
                    <div>{adminNotes || reason}</div>
                  </div>
                )}
                <button
                  className="mt-6 bg-[#C9AF2F] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#b79e29] transition-all duration-300 shadow-md"
                  onClick={() => setExistingApplication(null)}
                >
                  Apply Again
                </button>
              </>
            )}
            {status === "approved" && (
              <>
                <h2 className="text-2xl font-bold text-green-600 mb-2">
                  Congratulations!
                </h2>
                <p className="text-gray-700">
                  Your seller application has been approved. You can now access
                  your seller dashboard.
                </p>
                <Link
                  href="/dashboard/seller/profile"
                  className="inline-block mt-6 bg-[#C9AF2F] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#b79e29] transition-all duration-300 shadow-md"
                >
                  Go to Seller Dashboard
                </Link>
              </>
            )}
          </div>
        </main>
      </>
    );
  }

  const fields = [
    { label: "Store Name", name: "name", type: "text", required: true },
    { label: "Business Type", name: "business", type: "text", required: true },
    {
      label: "Type of Products",
      name: "products",
      type: "text",
      required: true,
    },
    { label: "Offers", name: "offers", type: "text", required: true },
    {
      label: "Title Picture URL",
      name: "imageUrl",
      type: "url",
      required: true,
      placeholder: "https://example.com/your-business-image.jpg",
    },
    { label: "Website (Optional)", name: "website", type: "url" },
    {
      label: "Email",
      name: "email",
      type: "email",
      required: true,
    },
    { label: "Phone Number", name: "phone", type: "tel", required: true },
    { label: "Phone Number #2 (Optional)", name: "phone2", type: "tel" },
    { label: "Phone Number #3 (Optional)", name: "phone3", type: "tel" },
    { label: "WhatsApp Number", name: "whatsapp", type: "tel", required: true },
    { label: "WhatsApp Number #2 (Optional)", name: "whatsapp2", type: "tel" },
    {
      label: "Landmark Nearby",
      name: "landmark",
      type: "text",
      required: true,
    },
  ];

  const socials = [
    { label: "Facebook", name: "facebook" },
    { label: "Instagram", name: "instagram" },
    { label: "Twitter", name: "twitter" },
    { label: "LinkedIn", name: "linkedin" },
  ];

  return (
    <>
      <Navbar />
      <main className="bg-gray-100 py-10 px-4 min-h-screen">
        <h1 className="text-center text-[#C9AF2F] text-3xl font-bold mb-10 uppercase">
          Become a Supplier
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-xl rounded-xl p-8 max-w-6xl mx-auto space-y-8"
        >
          <section>
            <h2 className="text-2xl font-bold text-[#C9AF2F] border-b pb-2 mb-6">
              Business Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map((field, i) => (
                <div key={i} className="flex flex-col">
                  <label className="text-gray-700 font-medium mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder || ""}
                    {...register(field.name, {
                      onChange: () => trigger(field.name),
                    })}
                    accept={field.accept || undefined}
                    className={`p-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                      errors[field.name]
                        ? "border-red-400 focus:ring-red-400"
                        : "border-gray-300 focus:ring-[#C9AF2F]"
                    }`}
                  />
                  {field.name === "imageUrl" && (
                    <p className="text-xs text-gray-500 mt-1">
                      Provide a direct link to your business image (JPG, PNG,
                      WebP formats recommended)
                    </p>
                  )}
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1 animate-pulse">
                      {errors[field.name].message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#C9AF2F] border-b pb-2 mb-6">
              Location Information
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex flex-col relative">
                <label className="text-gray-700 font-medium mb-1">
                  Business Location *
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search for your business location..."
                    value={searchQuery}
                    onChange={handleLocationInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md mb-2"
                    autoComplete="off"
                    spellCheck={false}
                    readOnly={!!selectedLocation}
                    onFocus={() => {
                      if (selectedLocation) {
                        setSearchQuery("");
                        setSelectedLocation(null);
                      }
                    }}
                  />
                  {selectedLocation && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLocation(null);
                        setSearchQuery("");
                      }}
                      className="ml-2 px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 mb-2"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {searchResults.length > 0 && (
                  <div className="bg-white border rounded shadow max-h-60 overflow-y-auto z-20 absolute mt-12 w-full">
                    {searchResults.map((feature) => (
                      <div
                        key={feature.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectPlace(feature)}
                      >
                        {feature.place_name}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <p className="text-sm text-gray-500">
                    Search for a location or click directly on the map below
                  </p>
                </div>
                {!selectedLocation && (
                  <p className="text-red-500 text-sm mt-1">
                    Please select a location to continue
                  </p>
                )}
              </div>
              {selectedLocation && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Selected Location:
                  </p>
                  <p className="font-medium text-green-600">
                    ✓ {selectedLocation.formattedAddress}
                  </p>

                  <div className="mt-4">
                    <label className="text-gray-700 font-medium mb-2 block">
                      Service Radius (km):{" "}
                      <span className="text-[#C9AF2F] font-bold">
                        {serviceRadius}
                      </span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={serviceRadius}
                      onChange={(e) => setServiceRadius(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #C9AF2F 0%, #C9AF2F ${serviceRadius}%, #e5e7eb ${serviceRadius}%, #e5e7eb 100%)`,
                      }}
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>1 km</span>
                      <span>100 km</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 h-64 rounded-lg overflow-hidden border-2 border-[#C9AF2F] relative">
              {mapError ? (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center flex-col">
                  <p className="text-red-500 mb-2">Failed to load map</p>
                  <button
                    type="button"
                    onClick={() => setMapError(false)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <Map
                  initialViewState={{
                    longitude:
                      selectedLocation?.coordinates?.coordinates?.[0] ??
                      67.0011,
                    latitude:
                      selectedLocation?.coordinates?.coordinates?.[1] ??
                      24.8607,
                    zoom: selectedLocation ? 13 : 10,
                  }}
                  style={{ width: "100%", height: "100%" }}
                  mapStyle="mapbox://styles/mapbox/streets-v11"
                  mapboxAccessToken={MAPBOX_TOKEN}
                  onMove={(evt) => setMapView(evt.viewState)}
                  onClick={handleMapClick}
                  attributionControl={false}
                  onError={() => {
                    setMapError(true);
                  }}
                >
                  <NavigationControl position="top-right" />
                  <GeolocateControl
                    position="top-right"
                    positionOptions={{ enableHighAccuracy: true }}
                    trackUserLocation={true}
                    auto={false}
                  />
                  {selectedLocation && (
                    <Marker
                      longitude={selectedLocation.coordinates.coordinates[0]}
                      latitude={selectedLocation.coordinates.coordinates[1]}
                      anchor="bottom"
                    >
                      <MapPin size={36} className="text-[#F7455D]" />
                    </Marker>
                  )}
                </Map>
              )}
              {!selectedLocation && !mapError && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center pointer-events-none">
                  <div className="bg-white bg-opacity-90 px-6 py-3 rounded-lg text-center">
                    <p>Click on the map to select your location</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                Business Description *
              </label>
              <textarea
                rows={5}
                placeholder="Describe your store, offerings, values..."
                {...register("description", {
                  onChange: () => trigger("description"),
                })}
                className={`p-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                  errors.description
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:ring-[#C9AF2F]"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1 animate-pulse">
                  {errors.description.message}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {watch("description")?.length || 0}/1000 characters
              </p>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                Business Address *
              </label>
              <textarea
                rows={5}
                placeholder="Enter your complete business address..."
                {...register("address", {
                  onChange: () => trigger("address"),
                })}
                className={`p-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                  errors.address
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:ring-[#C9AF2F]"
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1 animate-pulse">
                  {errors.address.message}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {watch("address")?.length || 0}/500 characters
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#C9AF2F] border-b pb-2 mb-6">
              Branding Services
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Select the branding services you provide to your customers:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    value: "Low MOQ",
                    label: "Low MOQ (Minimum Order Quality)",
                  },
                  {
                    value: "OEM Services",
                    label: "OEM Services (Original Equipment Manufacture)",
                  },
                  {
                    value: "Private Labeling",
                    label: "Private Labeling (Private Label Manufactures)",
                  },
                  {
                    value: "Ready to Ship",
                    label: "Ready to Ship (Deliver on time, every day)",
                  },
                ].map((service) => (
                  <div
                    key={service.value}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      id={service.value}
                      {...register("brandingServices")}
                      value={service.value}
                      className="w-4 h-4 text-[#C9AF2F] bg-gray-100 border-gray-300 rounded focus:ring-[#C9AF2F] focus:ring-2"
                    />
                    <label
                      htmlFor={service.value}
                      className="text-sm text-gray-700 font-medium cursor-pointer"
                    >
                      {service.label}
                    </label>
                  </div>
                ))}
              </div>
              {errors.brandingServices && (
                <p className="text-red-500 text-sm mt-1 animate-pulse">
                  {errors.brandingServices.message}
                </p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#C9AF2F] border-b pb-2 mb-4">
              Social Media Links (Optional)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {socials.map((social, i) => (
                <div key={i} className="flex flex-col">
                  <label className="text-gray-700 font-medium mb-1">
                    {social.label}
                  </label>
                  <input
                    type="url"
                    placeholder={`https://${social.label.toLowerCase()}.com/yourpage`}
                    {...register(social.name, {
                      onChange: () => trigger(social.name),
                    })}
                    className={`p-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                      errors[social.name]
                        ? "border-red-400 focus:ring-red-400"
                        : "border-gray-300 focus:ring-[#C9AF2F]"
                    }`}
                  />
                  {errors[social.name] && (
                    <p className="text-red-500 text-sm mt-1 animate-pulse">
                      {errors[social.name].message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <div className="text-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting || !selectedLocation}
              className="bg-[#C9AF2F] text-white font-semibold px-10 py-3 rounded-lg hover:bg-[#b79e29] transition-all duration-300 shadow-md w-full sm:w-48 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
            {!selectedLocation && (
              <p className="text-red-500 text-sm mt-2 animate-pulse">
                Please select a location to submit the application
              </p>
            )}
          </div>
        </form>
      </main>
    </>
  );
};

export default SellerProfile;
