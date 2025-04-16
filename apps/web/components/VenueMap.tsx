'use client';

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Initialize Mapbox
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface VenueMapProps {
  latitude: number;
  longitude: number;
  className?: string;
}

export function VenueMap({ latitude, longitude, className }: VenueMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: 15,
    });

    // Add marker
    marker.current = new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map.current);

    // Cleanup
    return () => {
      marker.current?.remove();
      map.current?.remove();
    };
  }, [latitude, longitude]);

  // Update marker position when coordinates change
  useEffect(() => {
    if (marker.current && map.current) {
      marker.current.setLngLat([longitude, latitude]);
      map.current.setCenter([longitude, latitude]);
    }
  }, [latitude, longitude]);

  return (
    <div
      ref={mapContainer}
      className={`w-full h-64 rounded-md overflow-hidden ${className || ''}`}
    />
  );
}
