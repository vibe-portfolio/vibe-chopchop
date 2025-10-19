import React, { useState, useRef, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Linking,
  Platform,
  TextInput,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X, DollarSign, Star, Search, ChefHat } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { restaurants } from "@/data/restaurants";
import { Restaurant, PriceLevel } from "@/types/restaurant";
import MapViewComponent from "@/components/MapView";

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [priceFilter, setPriceFilter] = useState<PriceLevel | null>(null);
  const [minRating, setMinRating] = useState<number>(0);
  const [minSmell, setMinSmell] = useState<number>(0);
  const [minFoodQuality, setMinFoodQuality] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const slideAnim = useRef(new Animated.Value(500)).current;
  const mapRef = useRef<any>(null);

  const initialRegion = {
    latitude: 47.6245,
    longitude: -122.3375,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      if (priceFilter && r.priceLevel !== priceFilter) return false;
      if (r.rating < minRating) return false;
      if (r.smellRating < minSmell) return false;
      if (r.foodQuality < minFoodQuality) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          r.name.toLowerCase().includes(query) ||
          r.cuisine.toLowerCase().includes(query) ||
          r.address.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [priceFilter, minRating, minSmell, minFoodQuality, searchQuery]);

  const handleMarkerPress = (restaurant: Restaurant) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedRestaurant(restaurant);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  const handleClose = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Animated.timing(slideAnim, {
      toValue: 500,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setSelectedRestaurant(null));
  };

  const handlePriceFilter = (price: PriceLevel) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setPriceFilter(priceFilter === price ? null : price);
  };

  const handleRatingFilter = (rating: number) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setMinRating(minRating === rating ? 0 : rating);
  };

  const handleSmellFilter = (smell: number) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setMinSmell(minSmell === smell ? 0 : smell);
  };

  const handleFoodQualityFilter = (quality: number) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setMinFoodQuality(minFoodQuality === quality ? 0 : quality);
  };

  const openWebsite = (url: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <MapViewComponent
        mapRef={mapRef}
        initialRegion={initialRegion}
        filteredRestaurants={filteredRestaurants}
        selectedRestaurant={selectedRestaurant}
        onMarkerPress={handleMarkerPress}
      />



      <View style={[styles.searchContainer, { top: 60 + insets.top }]}>
        <View style={styles.searchInputWrapper}>
          <Search size={20} color="#8E8E93" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants, cuisine, location..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={20} color="#8E8E93" strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={[styles.filterContainer, { top: 120 + insets.top }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Price</Text>
            <View style={styles.filterButtons}>
              {[1, 2, 3].map((price) => (
                <TouchableOpacity
                  key={price}
                  style={[
                    styles.filterButton,
                    priceFilter === price && styles.filterButtonActive,
                  ]}
                  onPress={() => handlePriceFilter(price as PriceLevel)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      priceFilter === price && styles.filterButtonTextActive,
                    ]}
                  >
                    {"$".repeat(price)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterDivider} />

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Rating</Text>
            <View style={styles.filterButtons}>
              {[4.0, 4.5].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.filterButton,
                    minRating === rating && styles.filterButtonActive,
                  ]}
                  onPress={() => handleRatingFilter(rating)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      minRating === rating && styles.filterButtonTextActive,
                    ]}
                  >
                    {rating}+
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterDivider} />

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Smell</Text>
            <View style={styles.filterButtons}>
              {[4.5, 4.8].map((smell) => (
                <TouchableOpacity
                  key={smell}
                  style={[
                    styles.filterButton,
                    minSmell === smell && styles.filterButtonActive,
                  ]}
                  onPress={() => handleSmellFilter(smell)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      minSmell === smell && styles.filterButtonTextActive,
                    ]}
                  >
                    {smell}+
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterDivider} />

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Food Quality</Text>
            <View style={styles.filterButtons}>
              {[4.5, 4.7].map((quality) => (
                <TouchableOpacity
                  key={quality}
                  style={[
                    styles.filterButton,
                    minFoodQuality === quality && styles.filterButtonActive,
                  ]}
                  onPress={() => handleFoodQualityFilter(quality)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      minFoodQuality === quality && styles.filterButtonTextActive,
                    ]}
                  >
                    {quality}+
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      {selectedRestaurant && (
        <Animated.View
          style={[
            styles.detailCard,
            {
              transform: [{ translateY: slideAnim }],
              paddingBottom: Math.max(40, insets.bottom + 24),
            },
          ]}
        >
          <View style={styles.detailHandle} />

          <View style={styles.detailHeader}>
            <View style={styles.detailHeaderLeft}>
              <Text style={styles.detailLogo}>{selectedRestaurant.logo}</Text>
              <View>
                <Text style={styles.detailName}>{selectedRestaurant.name}</Text>
                <Text style={styles.detailCuisine}>
                  {selectedRestaurant.cuisine}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={24} color="#8E8E93" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <View style={styles.detailStats}>
            <View style={styles.statItem}>
              <DollarSign size={16} color="#8E8E93" strokeWidth={2} />
              <Text style={styles.statText}>
                {"$".repeat(selectedRestaurant.priceLevel)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Star size={16} color="#8E8E93" strokeWidth={2} />
              <Text style={styles.statText}>
                {selectedRestaurant.rating.toFixed(1)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.smellEmoji}>👃</Text>
              <Text style={styles.statText}>
                {selectedRestaurant.smellRating.toFixed(1)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <ChefHat size={16} color="#8E8E93" strokeWidth={2} />
              <Text style={styles.statText}>
                {selectedRestaurant.foodQuality.toFixed(1)}
              </Text>
            </View>
          </View>

          <Text style={styles.detailAddress}>{selectedRestaurant.address}</Text>

          <TouchableOpacity
            style={styles.websiteButton}
            onPress={() => openWebsite(selectedRestaurant.website)}
          >
            <Text style={styles.websiteButtonText}>Visit Website</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  searchContainer: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 11,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
    paddingVertical: 4,
  },
  filterContainer: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },
  filterSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  filterDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#E5E5EA",
  },
  filterLabel: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#000000",
  },
  filterButtons: {
    flexDirection: "row",
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
  },
  filterButtonActive: {
    backgroundColor: "#000000",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#000000",
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
  },
  detailCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  detailHandle: {
    width: 36,
    height: 5,
    backgroundColor: "#D1D1D6",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 20,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  detailLogo: {
    fontSize: 48,
  },
  detailName: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: "#000000",
  },
  detailCuisine: {
    fontSize: 15,
    color: "#8E8E93",
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  detailStats: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#000000",
  },
  smellEmoji: {
    fontSize: 16,
  },
  detailAddress: {
    fontSize: 15,
    color: "#8E8E93",
    marginBottom: 20,
  },
  websiteButton: {
    backgroundColor: "#000000",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  websiteButtonText: {
    fontSize: 17,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
});
