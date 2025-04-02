import React, { useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { LocationSearch } from "../components/LocationSearch";
import { LocationResult } from "../hooks/useLocationSearch";

export default function LocationSearchExample() {
  const [selectedLocation, setSelectedLocation] =
    useState<LocationResult | null>(null);

  const handleSelectLocation = (location: LocationResult) => {
    setSelectedLocation(location);
    console.log("Selected location:", location);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-5 flex-1">
        <Text className="text-2xl font-bold mb-2">Venue Search</Text>
        <Text className="text-base text-gray-600 mb-6">
          Find a location for your event
        </Text>

        <View className="mb-6">
          <LocationSearch
            onSelectLocation={handleSelectLocation}
            placeholder="Search for venues, restaurants, etc."
          />
        </View>

        {selectedLocation && (
          <View className="bg-white p-4 rounded-lg border border-gray-200">
            <Text className="text-lg font-semibold mb-3 text-gray-700">
              Selected Venue
            </Text>
            <Text className="text-xl font-bold mb-1">
              {selectedLocation.name}
            </Text>
            <Text className="text-base text-gray-600 mb-2">
              {selectedLocation.address}
            </Text>
            <Text className="text-sm text-gray-500">
              Lat: {selectedLocation.coordinates.latitude.toFixed(4)}, Lng:{" "}
              {selectedLocation.coordinates.longitude.toFixed(4)}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
