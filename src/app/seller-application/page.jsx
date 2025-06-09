"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Navbar from "../components/common/Navbar";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { sellerApplicationSchema } from "@/lib/validations";

const libraries = ["places"];

const SellerProfile = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [serviceRadius, setServiceRadius] = useState(10);
  const placeAutocompleteRef = useRef(null);
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
    mode: "onChange", // Enable real-time validation
    reValidateMode: "onChange",
  });

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      toast.error("Please login to submit seller application");
      router.push("/log-in");
    }
  }, [session, status, router]);

  const handlePlaceSelect = useCallback((place) => {
    if (place.geometry && place.geometry.location) {
      const location = {
        address: place.displayName || place.formattedAddress || "",
        coordinates: {
          type: "Point",
          coordinates: [
            place.geometry.location.lng(),
            place.geometry.location.lat(),
          ],
        },
        placeId: place.place_id || place.id,
        formattedAddress: place.formattedAddress || place.displayName,
        addressComponents: {},
        viewport: place.geometry.viewport
          ? {
              northeast: {
                lat: place.geometry.viewport.getNorthEast().lat(),
                lng: place.geometry.viewport.getNorthEast().lng(),
              },
              southwest: {
                lat: place.geometry.viewport.getSouthWest().lat(),
                lng: place.geometry.viewport.getSouthWest().lng(),
              },
            }
          : null,
      };

      // Parse address components if available
      if (place.addressComponents) {
        place.addressComponents.forEach((component) => {
          const types = component.types;
          if (types.includes("street_number")) {
            location.addressComponents.streetNumber = component.longText;
          }
          if (types.includes("route")) {
            location.addressComponents.route = component.longText;
          }
          if (types.includes("locality")) {
            location.addressComponents.locality = component.longText;
          }
          if (types.includes("sublocality")) {
            location.addressComponents.sublocality = component.longText;
          }
          if (types.includes("administrative_area_level_1")) {
            location.addressComponents.administrativeAreaLevel1 =
              component.longText;
          }
          if (types.includes("administrative_area_level_2")) {
            location.addressComponents.administrativeAreaLevel2 =
              component.longText;
          }
          if (types.includes("country")) {
            location.addressComponents.country = component.longText;
          }
          if (types.includes("postal_code")) {
            location.addressComponents.postalCode = component.longText;
          }
        });
      }

      setSelectedLocation(location);
      toast.success("Location selected successfully!");
    }
  }, []);

  useEffect(() => {
    if (isLoaded && window.google && window.google.maps.places) {
      const placeAutocompleteElement = document.createElement(
        "gmp-place-autocomplete"
      );

      // Configure the element
      placeAutocompleteElement.setAttribute(
        "placeholder",
        "Search for your business location..."
      );
      placeAutocompleteElement.setAttribute("country-restriction", "pk"); // Adjust for your country
      placeAutocompleteElement.setAttribute("type", "establishment");

      // Style the element
      placeAutocompleteElement.style.width = "100%";
      placeAutocompleteElement.style.padding = "8px";
      placeAutocompleteElement.style.border = "1px solid #ACAAAA";
      placeAutocompleteElement.style.borderRadius = "6px";
      placeAutocompleteElement.style.fontSize = "14px";
      placeAutocompleteElement.style.outline = "none";

      // Add event listener for place selection
      placeAutocompleteElement.addEventListener("gmp-placeselect", (event) => {
        const place = event.detail.place;
        handlePlaceSelect(place);
      });

      // Replace the input with the new element
      const container = document.getElementById("place-autocomplete-container");
      if (container) {
        container.innerHTML = "";
        container.appendChild(placeAutocompleteElement);
        placeAutocompleteRef.current = placeAutocompleteElement;
      }
    }
  }, [isLoaded, handlePlaceSelect]);

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

      // Add location data
      formData.append("location", JSON.stringify(selectedLocation));
      formData.append("serviceRadius", serviceRadius.toString());

      // Add all other form fields
      Object.keys(data).forEach((key) => {
        if (key === "image" && data[key]?.[0]) {
          formData.append("image", data[key][0]);
        } else if (key !== "location" && data[key]) {
          formData.append(key, data[key]);
        }
      });

      const response = await axios.post("/api/seller/apply", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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

  // Show loading while checking authentication
  if (status === "loading") {
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

  if (!isLoaded) {
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
      label: "Title Picture",
      name: "image",
      type: "file",
      required: true,
      accept: "image/*",
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
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1">
                  Business Location *
                </label>
                <div id="place-autocomplete-container" className="w-full" />
                <p className="text-sm text-gray-500 mt-1">
                  Start typing to see location suggestions
                </p>
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

            {selectedLocation && (
              <div className="mt-6 h-64 rounded-lg overflow-hidden border-2 border-[#C9AF2F]">
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={{
                    lat: selectedLocation.coordinates.coordinates[1],
                    lng: selectedLocation.coordinates.coordinates[0],
                  }}
                  zoom={15}
                  onLoad={setMap}
                >
                  <Marker
                    position={{
                      lat: selectedLocation.coordinates.coordinates[1],
                      lng: selectedLocation.coordinates.coordinates[0],
                    }}
                    animation={window.google?.maps?.Animation?.BOUNCE}
                  />
                </GoogleMap>
              </div>
            )}
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
