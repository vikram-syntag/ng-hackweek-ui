import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

export type GeoJSONData = FeatureCollection<Geometry, GeoJsonProperties>;

export interface GeoJSONFeature {
  type: "Feature";
  properties: Record<string, any>;
  geometry: {
    type: string;
    coordinates: number[][][] | number[][];
  };
}

// export interface GeoJSONData {
//   type: "FeatureCollection";
//   features: GeoJSONFeature[];
// }

export interface MissionRun {
  id: string;
  timestamp: Date;
  uavCount: number;
  height: number;
  speed: number;
  distance: number;
  estimatedTime: number;
  geoJSON: { name: string; data: GeoJSONData; color: string }[];
}