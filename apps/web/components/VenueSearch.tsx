'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';
import { VenueSearchResult } from '@whichcraft/api-client';

export interface VenueSearchProps {
  onSelect: (venue: VenueSearchResult | null) => void;
  placeholder?: string;
  className?: string;
}

export function VenueSearch({
  onSelect,
  placeholder = 'Search for a venue...',
  className,
}: VenueSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<VenueSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(
    null
  );
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get user's location on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleSearch = async () => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);

    try {
      // Build the search URL with location if available
      let searchUrl = `/api/search/venue?q=${encodeURIComponent(searchTerm)}`;
      if (userLocation) {
        searchUrl += `&lat=${userLocation.latitude}&lng=${userLocation.longitude}`;
      }

      const response = await fetch(searchUrl);
      const data = await response.json();

      if (Array.isArray(data)) {
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching for venues:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative w-full space-y-2 ${className}`}>
      <div className="relative w-full">
        <div className="relative">
          <Input
            ref={searchInputRef}
            placeholder={placeholder}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
            onFocus={() => {
              if (searchResults.length > 0) setIsOpen(true);
            }}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
            onClick={handleSearch}
            disabled={isLoading}
          >
            <Search className="h-4 w-4" />
            {isLoading && <span className="sr-only">Loading...</span>}
          </Button>
        </div>

        {/* Results dropdown */}
        {isOpen && searchResults.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground shadow-md rounded-md border overflow-hidden"
          >
            <ul className="divide-y">
              {searchResults.map(venue => (
                <li key={venue.id}>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full justify-start text-left p-2 sm:p-3 h-auto rounded-none hover:bg-accent"
                    onClick={() => {
                      onSelect(venue);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">{venue.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {[venue.address, venue.city, venue.state].filter(Boolean).join(', ')}
                        </div>
                      </div>
                    </div>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSearch} disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>
    </div>
  );
}
