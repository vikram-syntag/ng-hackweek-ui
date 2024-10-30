import { GeoJSONData } from "./types";

export function generateRandomColor(): string {
  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD",
    "#D4A5A5", "#9B59B6", "#3498DB", "#E67E22", "#2ECC71"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function calculatePathLength(coordinates: number[][]): number {
  let length = 0;
  for (let i = 1; i < coordinates.length; i++) {
    const [x1, y1] = coordinates[i - 1];
    const [x2, y2] = coordinates[i];
    length += Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
  return length;
}

export function calculateMissionDuration(
  files: { name: string; data: GeoJSONData }[],
  speed: number
): string {
  let maxLength = 0;

  files.forEach(file => {
    file.data.features.forEach(feature => {
      if (feature.geometry.type === "LineString") {
        const length = calculatePathLength(feature.geometry.coordinates as number[][]);
        maxLength = Math.max(maxLength, length);
      }
    });
  });

  // Convert to seconds
  const totalSeconds = Math.ceil((maxLength * 111000) / speed); // Convert degrees to meters (rough approximation)
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}m ${seconds}s`;
}