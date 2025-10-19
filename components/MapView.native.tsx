import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Restaurant } from "@/types/restaurant";

interface MapViewNativeProps {
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

export default function MapViewNative({
  mapRef,
  initialRegion,
  filteredRestaurants,
  selectedRestaurant,
  onMarkerPress,
}: MapViewNativeProps) {
  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={initialRegion}
      showsUserLocation
      showsMyLocationButton={false}
      showsCompass={false}
      toolbarEnabled={false}
    >
      {filteredRestaurants.map((restaurant) => (
        <Marker
          key={restaurant.id}
          coordinate={{
            latitude: restaurant.latitude,
            longitude: restaurant.longitude,
          }}
          onPress={() => onMarkerPress(restaurant)}
        >
          <View style={styles.markerContainer}>
            <View
              style={[
                styles.marker,
                selectedRestaurant?.id === restaurant.id &&
                  styles.markerSelected,
              ]}
            >
              <Text style={styles.markerEmoji}>{restaurant.logo}</Text>
            </View>
          </View>
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  markerSelected: {
    backgroundColor: "#007AFF",
    transform: [{ scale: 1.15 }],
  },
  markerEmoji: {
    fontSize: 24,
  },
});
