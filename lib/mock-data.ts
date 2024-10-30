import { MissionRun } from "./types";
import { FeatureCollection, Geometry } from "geojson";


export const mockGeoJSON: FeatureCollection<Geometry> = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
            [-116.88217014987498, 36.262937037562324],
            [-116.88166430973317, 36.21966440483398],
            [-116.82546003962204, 36.26281249264389],
            [-116.88217014987498, 36.262937037562324]
          ]
        ],
        "type": "Polygon"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [-116.8820179985648, 36.26297911052535],
          [-116.88153550622428, 36.21997008024353],
          [-116.87677313930163, 36.223496122318835],
          [-116.87692582887655, 36.262866628220735],
          [-116.88215944214636, 36.26297906695997]
        ],
        "type": "LineString"
      }
    }
  ]
};

// Helper function to adjust coordinates based on the geometry type and offset values
const adjustCoordinates = (
  geometry: any,
  xOffset: number,
  yOffset: number
) => {
  if (geometry.type === "Polygon") {
    return [
      geometry.coordinates[0].map(([x, y]: [number, number]) => [
        x + xOffset,
        y + yOffset,
      ]),
    ];
  } else if (geometry.type === "LineString") {
    return geometry.coordinates.map(([x, y]: [number, number]) => [
      x + xOffset,
      y + yOffset,
    ]);
  }
  return geometry.coordinates;
};

export const mockPreviousRuns: MissionRun[] = [
  {
    id: "1",
    timestamp: new Date("2024-03-20T10:00:00"),
    uavCount: 3,
    height: 100,
    speed: 15,
    distance: 25.5,
    estimatedTime: 102,
    geoJSON: [
      { name: "UAV-1.json", data: mockGeoJSON, color: "#FF6B6B" },
      { 
        name: "UAV-2.json",
        data: {
          ...mockGeoJSON,
          features: mockGeoJSON.features.map(f => ({
            ...f,
            geometry: {
              ...f.geometry,
              coordinates: adjustCoordinates(f.geometry, 0.01, -0.01),
            },
          }))
        },
        color: "#4ECDC4"
      },
      {
        name: "UAV-3.json",
        data: {
          ...mockGeoJSON,
          features: mockGeoJSON.features.map(f => ({
            ...f,
            geometry: {
              ...f.geometry,
              coordinates: adjustCoordinates(f.geometry, -0.01, 0.01),
            },
          }))
        },
        color: "#45B7D1"
      }
    ]
  },
  {
    id: "2",
    timestamp: new Date("2024-03-19T15:30:00"),
    uavCount: 2,
    height: 80,
    speed: 12,
    distance: 18.3,
    estimatedTime: 91,
    geoJSON: [
      { name: "UAV-1.json", data: mockGeoJSON, color: "#96CEB4" },
      {
        name: "UAV-2.json",
        data: {
          ...mockGeoJSON,
          features: mockGeoJSON.features.map(f => ({
            ...f,
            geometry: {
              ...f.geometry,
              coordinates: adjustCoordinates(f.geometry, 0.015, -0.015),
            },
          }))
        },
        color: "#FFEEAD"
      }
    ]
  }
];