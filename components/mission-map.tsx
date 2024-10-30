"use client";

import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { GeoJSONData } from "@/lib/types";

mapboxgl.accessToken = "pk.eyJ1IjoidmlrcmFta2giLCJhIjoiY20ydjZmNGsxMGE0ZzJrb2Jwb3RsaHg0biJ9.xdg1WoVSoN_I8G_TOd0bHw";

interface MissionMapProps {
  geoJSONFiles: { name: string; data: GeoJSONData; color: string }[];
}

export function MissionMap({ geoJSONFiles }: MissionMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [-116.85, 36.24],
      zoom: 12,
    });

    const mapInstance = map.current;

    mapInstance.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      mapInstance.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing sources and layers
    geoJSONFiles.forEach((_, index) => {
      const sourceId = `mission-data-${index}`;
      if (map.current!.getSource(sourceId)) {
        const polygonId = `polygons-${index}`;
        const lineId = `lines-${index}`;
        if (map.current!.getLayer(polygonId)) {
          map.current!.removeLayer(polygonId);
        }
        if (map.current!.getLayer(lineId)) {
          map.current!.removeLayer(lineId);
        }
        map.current!.removeSource(sourceId);
      }
    });

    // Add new sources and layers
    geoJSONFiles.forEach((file, index) => {
      const sourceId = `mission-data-${index}`;
      
      map.current!.addSource(sourceId, {
        type: "geojson",
        data: file.data as GeoJSONData,
      });

      // Add polygon layer
      map.current!.addLayer({
        id: `polygons-${index}`,
        type: "fill",
        source: sourceId,
        filter: ["==", ["geometry-type"], "Polygon"],
        paint: {
          "fill-color": file.color,
          "fill-opacity": 0.4,
        },
      });

      // Add line layer
      map.current!.addLayer({
        id: `lines-${index}`,
        type: "line",
        source: sourceId,
        filter: ["==", ["geometry-type"], "LineString"],
        paint: {
          "line-color": file.color,
          "line-width": 2,
        },
      });
    });

    // Fit bounds to show all features
    if (geoJSONFiles.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      geoJSONFiles.forEach(file => {
        file.data.features.forEach(feature => {
          if (feature.geometry.type === "Polygon") {
            (feature.geometry.coordinates[0] as number[][]).forEach(coord => {
              bounds.extend(coord as [number, number]);
            });
          } else if (feature.geometry.type === "LineString") {
            (feature.geometry.coordinates as number[][]).forEach(coord => {
              bounds.extend(coord as [number, number]);
            });
          }
        });
      });
      map.current!.fitBounds(bounds, { padding: 50 });
    }
  }, [geoJSONFiles, mapLoaded]);

  return <div ref={mapContainer} className="w-full h-screen" />;
}