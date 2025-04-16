import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Platform,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocationSearch, LocationResult } from "../hooks/useLocationSearch";
import { useThemeColor } from "../hooks/useThemeColor";
import { Search, X, MapPin } from "lucide-react-native";

interface LocationSearchProps {
  onSelectLocation?: (location: LocationResult | null) => void;
  placeholder?: string;
}

export function LocationSearch({
  onSelectLocation,
  placeholder = "Search for a venue...",
}: LocationSearchProps) {
  const {
    query,
    setQuery,
    results,
    setResults,
    isLoading,
    error,
    searchLocations,
  } = useLocationSearch();
  const { colors } = useThemeColor();
  const [showResults, setShowResults] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<LocationResult | null>(
    null
  );
  const searchInputRef = useRef<TextInput>(null);

  // Search when user types
  useEffect(() => {
    if (query.length > 2) {
      searchLocations(query);
    } else if (query.length === 0) {
      // Clear results when input is cleared
      setResults([]);
    }
  }, [query, searchLocations, setResults]);

  const handleSelect = (location: LocationResult) => {
    setSelectedVenue(location);
    if (onSelectLocation) {
      onSelectLocation(location);
    }
    setQuery("");
    setShowResults(false);
  };

  const handleModalClose = () => {
    Keyboard.dismiss();
    setQuery(""); // Clear search input
    setShowResults(false);
  };

  const handleClear = () => {
    setSelectedVenue(null);
    if (onSelectLocation) {
      onSelectLocation(null);
    }
  };

  return (
    <View className="w-full">
      <TouchableOpacity
        className="bg-secondary rounded-lg py-3 px-4 gap-2 flex-row items-center"
        onPress={() => setShowResults(true)}
      >
        {selectedVenue ?
          <>
            <MapPin size={20} color={colors.mutedForeground} />
            <Text className="text-foreground flex-1" numberOfLines={1}>
              {selectedVenue.name}
            </Text>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="ml-2"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          </>
        : <>
            <Search size={20} color={colors.mutedForeground} />
            <Text className="text-muted-foreground flex-1">{placeholder}</Text>
          </>
        }
      </TouchableOpacity>

      {error && (
        <View className="p-4 bg-destructive/10 rounded-lg mt-2">
          <Text className="text-destructive">{error}</Text>
        </View>
      )}

      <Modal
        visible={showResults}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleModalClose}
      >
        <SafeAreaView className="flex-1 bg-background">
          <View className="flex-1">
            {/* Header */}
            <View className="bg-background">
              <View className="p-4 flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-foreground">
                  Select Location
                </Text>
                <TouchableOpacity
                  onPress={handleModalClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <X size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Search Input */}
              <View className="px-4 pb-4">
                <View className="relative flex-row items-center bg-secondary rounded-lg">
                  <View className="px-3">
                    <Search size={20} color={colors.mutedForeground} />
                  </View>
                  <TextInput
                    ref={searchInputRef}
                    className="flex-1 py-3 pl-2 pr-4 text-foreground"
                    value={query}
                    onChangeText={setQuery}
                    placeholder={placeholder}
                    placeholderTextColor={colors.mutedForeground}
                    autoCorrect={false}
                    returnKeyType="search"
                    clearButtonMode="while-editing"
                    autoFocus
                  />
                </View>
              </View>
            </View>

            {/* Content */}
            <View className="flex-1">
              {isLoading ?
                <View className="flex-1 items-center justify-center">
                  <ActivityIndicator size="large" color={colors.primary} />
                </View>
              : results.length > 0 ?
                <FlatList
                  data={results}
                  keyExtractor={(item) => item.id}
                  className="flex-1"
                  contentContainerStyle={{ padding: 16 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className="p-4 bg-secondary rounded-lg mb-2"
                      onPress={() => handleSelect(item)}
                    >
                      <Text className="text-base font-medium text-foreground">
                        {item.name}
                      </Text>
                      <Text className="text-sm text-muted-foreground mt-1">
                        {item.address}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              : query.length > 2 ?
                <View className="p-4">
                  <Text className="text-muted-foreground text-center">
                    No locations found
                  </Text>
                </View>
              : <View className="p-4">
                  <Text className="text-muted-foreground text-center">
                    Start typing to search for locations
                  </Text>
                </View>
              }
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
