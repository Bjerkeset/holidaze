"use client";
import * as React from "react";
import Map, {
  Source,
  Layer,
  MapLayerMouseEvent,
  AttributionControl,
} from "react-map-gl";
import type { SymbolLayer } from "react-map-gl";

import type { FeatureCollection } from "geojson";
import { VenueType } from "@/lib/validation/types";
import VenueCard from "../cards/venue-card-sm";

const layerStyle: SymbolLayer = {
  id: "point",
  type: "symbol",
  layout: {
    "icon-image": "house-icon", // Reference the image by name
    "icon-size": 0.1, // Adjust the size of the icon
  },
};

type Props = {
  venues?: VenueType[];
};

export default function VenueMap({ venues }: Props) {
  const [selectedVenue, setSelectedVenue] = React.useState<VenueType | null>(
    null
  );

  // Convert venues to GeoJSON format
  const geojson: FeatureCollection = {
    type: "FeatureCollection",
    features:
      venues
        ?.filter(
          (venue) => venue.location.lat !== null && venue.location.lng !== null
        ) // Ensure coordinates are not null
        .map((venue) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [
              venue.location.lng as number,
              venue.location.lat as number,
            ], // Ensure coordinates are numbers
          },
          properties: {
            id: venue.id,
            name: venue.name,
            description: venue.description,
            price: venue.price,
            maxGuests: venue.maxGuests,
            rating: venue.rating,
          },
        })) || [],
  };

  const handleClick = (event: MapLayerMouseEvent) => {
    const features = event.features;
    if (features && features.length > 0) {
      const clickedFeature = features[0];
      const clickedVenueId = clickedFeature.properties?.id;
      const clickedVenue = venues?.find((venue) => venue.id === clickedVenueId);
      setSelectedVenue(clickedVenue || null);
    }
  };

  return (
    <div className="relative py-10">
      {selectedVenue && (
        <div className="absolute top-10 left-10 bg-accent z-50 w-52 p-4 rounded-2xl">
          <VenueCard venue={selectedVenue} className={"w-24"} />
        </div>
      )}
      <Map
        mapboxAccessToken="pk.eyJ1IjoiYmVuNDMxNTEiLCJhIjoiY2x3NjR6ZzY2MW5iMDJxcGgydmZ6ZGF0aSJ9.erjjSR7REFjEuHMtfuTVIQ"
        initialViewState={{
          longitude: 10.7522,
          latitude: 59.9139,
          zoom: 12,
        }}
        style={{ width: "100%", height: "500px" }}
        mapStyle="mapbox://styles/mapbox/light-v10"
        interactiveLayerIds={["point"]}
        onClick={handleClick}
        attributionControl={false}
        onLoad={(event) => {
          const map = event.target;
          map.loadImage(
            "https://static.vecteezy.com/system/resources/thumbnails/000/355/795/small/Real_Estate__28101_29.jpg",
            (error, image) => {
              if (error) throw error;
              if (image) {
                map.addImage("house-icon", image);
              }
            }
          );
        }}
      >
        <Source id="my-data" type="geojson" data={geojson}>
          <Layer {...layerStyle} />
        </Source>
      </Map>
    </div>
  );
}
