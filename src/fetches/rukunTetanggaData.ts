import urls from '../data/pops/kependudukan-fetch-urls.json';
import {
  RukunTetanggaGeoJSON,
  RukunTetanggaFeature
} from '../types/rukunTetangga';

// Function to fetch a GeoJSON object from a URL
async function fetchGeoJSON(url: string): Promise<RukunTetanggaGeoJSON> {
  const response = await fetch(url);
  const data = (await response.json()) as RukunTetanggaGeoJSON;
  return data;
}

function parseGeoJSON(geoJSON: RukunTetanggaGeoJSON): RukunTetanggaGeoJSON {
  const parsedFeatures = geoJSON.features.map((feature) => {
    const coordinates = feature.geometry.coordinates[0].map(([x, y]) => [
      y,
      x
    ]) as Array<[number, number]>;

    return {
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates: [coordinates]
      }
    };
  });

  return {
    ...geoJSON,
    features: parsedFeatures
  };
}

const batchSize = 3;

// Fetch GeoJSON objects from the URLs and store them in an array
export async function fetchAndCombineGeoJSONs(): Promise<RukunTetanggaGeoJSON> {
  const parsedGeoJsons: RukunTetanggaGeoJSON[] = [];

  for (let i = 0; i < urls.length; i += batchSize) {
    const batchUrls = urls.slice(i, i + batchSize);
    const geoJsons = await Promise.all(batchUrls.map(fetchGeoJSON));
    const parsedBatchGeoJsons = geoJsons
      .filter((item) => item.features)
      .map(parseGeoJSON);
    parsedGeoJsons.push(...parsedBatchGeoJsons);
  }

  // Sort the fetched objects based on their `translate` values
  parsedGeoJsons.sort((a, b) => {
    const [ax, ay] = a.transform.translate;
    const [bx, by] = b.transform.translate;

    if (ay !== by) {
      return ay - by;
    }
    return ax - bx;
  });

  // Combine the sorted objects into a single GeoJSON object
  const combinedGeoJSON: RukunTetanggaGeoJSON = {
    type: 'FeatureCollection',
    crs: parsedGeoJsons[0].crs,
    transform: parsedGeoJsons[0].transform,
    features: ([] as RukunTetanggaFeature[]).concat(
      ...parsedGeoJsons.map((g) => g.features)
    )
  };

  return combinedGeoJSON;
}

// Usage example
// fetchAndCombineGeoJSONs()
//   .then((combinedGeoJSON) => {
//     console.log(combinedGeoJSON);
//   })
//   .catch((error) => {
//     console.error('Failed to fetch and combine GeoJSONs:', error);
// });
