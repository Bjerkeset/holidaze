"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import mapStyle from "./mapStyle.json";
import { VenueType } from "@/lib/validation/types";
import MarkerDropdown from "./marker";
import { createRoot } from "react-dom/client"; // Import createRoot
import { useSearchParams } from "next/navigation";
import VenueCard from "../cards/venue-card-sm";

interface MapProps {
  address?: string;
  data?: VenueType[];
}

export default function Map({ address, data }: MapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
  const [noAddressFound, setNoAddressFound] = useState(false); // State for "No address found" message

  const searchParams = useSearchParams();
  const searchValue = searchParams.get("search");

  // Function to convert SVG to Data URL
  const svgToDataURL = (svg: string) => {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };

  // Function to render the lucide-react icon as an SVG string
  const renderIconToString = () => {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
    return svgToDataURL(svgString);
  };

  const customIconUrl = renderIconToString();

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: "weekly",
    });

    loader.load().then(() => {
      const defaultLocation = { lat: 59.9139, lng: 10.7522 }; // Default to Oslo, Norway
      const mapInstance = new google.maps.Map(mapRef.current!, {
        center: defaultLocation,
        zoom: 8,
        styles: mapStyle as google.maps.MapTypeStyle[], // Apply the custom style
        mapTypeControl: false, // Disable map/satellite toggle
        zoomControl: false, // Disable zoom control
        streetViewControl: false, // Disable street view control
        // fullscreenControl: false, // Disable fullscreen control
      });
      setMap(mapInstance);
      setGeocoder(new google.maps.Geocoder());

      // If no address is provided, still center at Oslo with a marker
      if (!address) {
        new google.maps.Marker({
          map: mapInstance,
          position: defaultLocation,
          icon: customIconUrl, // Use custom icon
        });
      }

      // Add markers for each venue
      const markers = data?.map((venue) => {
        const marker = new google.maps.Marker({
          map: mapInstance,
          position: { lat: venue.location.lat!, lng: venue.location.lng! },
          title: venue.name,
          icon: customIconUrl,
        });

        // Create an InfoWindow with the dropdown menu
        const infoWindow = new google.maps.InfoWindow({
          content: document.createElement("div"), // Create a container div
        });

        marker.addListener("click", () => {
          infoWindow.open(mapInstance, marker);
          renderMarkerDropdown(venue, infoWindow);
          mapInstance.setCenter(marker.getPosition()!);
          mapInstance.setZoom(12);
        });

        return { marker, venue, infoWindow };
      });

      // Check if searchParams matches any venue and trigger the same behavior as clicking the marker
      if (searchValue) {
        const matchingVenue = markers?.find(
          ({ venue }) => venue.name.toLowerCase() === searchValue.toLowerCase()
        );

        if (matchingVenue) {
          const { marker, venue, infoWindow } = matchingVenue;
          infoWindow.open(mapInstance, marker);
          renderMarkerDropdown(venue, infoWindow);
          mapInstance.setCenter(marker.getPosition()!);
          mapInstance.setZoom(12);
        }
      }
    });
  }, [data, searchValue]);

  const renderMarkerDropdown = (
    venue: VenueType,
    infoWindow: google.maps.InfoWindow
  ) => {
    const content = infoWindow.getContent() as HTMLElement;
    content.id = `marker-${venue.id}`;

    const root = createRoot(content); // Use createRoot
    root.render(
      <div
        style={{
          width: "250px",
          // height: "300px",
        }}
      >
        <VenueCard venue={venue} xs />
      </div>
    );
  };

  useEffect(() => {
    if (map && geocoder && address) {
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results[0]) {
          map.setCenter(results[0].geometry.location);
          map.setZoom(12);
          new google.maps.Marker({
            map,
            position: results[0].geometry.location,
            icon: customIconUrl,
          });
          setNoAddressFound(false);
        } else {
          console.error(
            `Geocode was not successful for the following reason: ${status}`
          );
          setNoAddressFound(true); // No address found
        }
      });
    }
  }, [address, map, geocoder]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {noAddressFound ? (
        <div>Location not found...</div>
      ) : (
        <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
      )}
    </div>
  );
}
