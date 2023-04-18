import { simplify } from '@turf/turf';

/**
 * Simplifies the coordinates of a polygon.
 *
 * @param {number[][]} coordinates - The original coordinates of the polygon.
 * @param {number} tolerance - The tolerance value to use for simplification. Higher values result in a more simplified geometry.
 * @param {boolean} [highQuality=false] - Whether to use the high-quality simplification algorithm. Defaults to false.
 * @returns {number[][]} The simplified coordinates of the polygon.
 */
export function simplifyPolygonCoordinates(
  coordinates: number[][],
  tolerance: number,
  highQuality = false
) {
  // Convert the coordinates to a GeoJSON Polygon
  const geoJsonPolygon = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [coordinates]
    }
  };

  // Simplify the GeoJSON Polygon
  const simplifiedGeoJsonPolygon = simplify(geoJsonPolygon.geometry, {
    tolerance: tolerance,
    highQuality: highQuality
  });

  // Return the simplified coordinates
  return simplifiedGeoJsonPolygon.coordinates[0];
}
