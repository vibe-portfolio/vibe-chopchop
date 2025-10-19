import React, { useEffect, useRef, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { Restaurant } from "@/types/restaurant";

interface MapViewWebProps {
  mapRef: React.RefObject<any>;
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  filteredRestaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  onMarkerPress: (restaurant: Restaurant) => void;
}

export default function MapViewWeb({
  mapRef,
  initialRegion,
  filteredRestaurants,
  selectedRestaurant,
  onMarkerPress,
}: MapViewWebProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const updateMarkers = useCallback(() => {
    const L = (window as any).L;
    if (!L || !leafletMapRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    filteredRestaurants.forEach((restaurant) => {
      const isSelected = selectedRestaurant?.id === restaurant.id;
      const icon = L.divIcon({
        html: `
          <div style="
            width: 44px;
            height: 44px;
            border-radius: 22px;
            background: ${isSelected ? "#007AFF" : "#FFFFFF"};
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            font-size: 24px;
            transform: ${isSelected ? "scale(1.15)" : "scale(1)"};
            transition: all 0.2s ease;
            cursor: pointer;
          ">
            ${restaurant.logo}
          </div>
        `,
        className: "",
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      const marker = L.marker([restaurant.latitude, restaurant.longitude], {
        icon,
      })
        .addTo(leafletMapRef.current)
        .on("click", () => onMarkerPress(restaurant));

      markersRef.current.push(marker);
    });
  }, [filteredRestaurants, selectedRestaurant, onMarkerPress]);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const loadLeaflet = async () => {
      const L = (window as any).L;
      if (!L) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => initMap();
        document.head.appendChild(script);
      } else {
        initMap();
      }
    };

    const initMap = () => {
      const L = (window as any).L;
      if (!L || !containerRef.current || leafletMapRef.current) return;

      const map = L.map(containerRef.current, {
        zoomControl: true,
        attributionControl: false,
      }).setView([initialRegion.latitude, initialRegion.longitude], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      leafletMapRef.current = map;
      mapRef.current = map;

      updateMarkers();
    };

    loadLeaflet();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [initialRegion.latitude, initialRegion.longitude, mapRef, updateMarkers]);

  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  return (
    <View style={styles.container}>
      <div
        ref={containerRef as any}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
});
