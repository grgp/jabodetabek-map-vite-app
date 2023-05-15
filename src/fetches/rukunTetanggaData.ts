import { transform } from 'ol/proj';
import urls from '../data/pops/kependudukan-fetch-urls-fix-1.json';
import { RukunTetanggaGeoJSON } from '../types/rukunTetangga';
import { saveToFile } from '../utils/files';

// Function to fetch a GeoJSON object from a URL
async function fetchGeoJSON(url: string): Promise<RukunTetanggaGeoJSON> {
  const response = await fetch(url);
  const data = (await response.json()) as RukunTetanggaGeoJSON;
  return data;
}

function parseGeoJSON(geoJSON: RukunTetanggaGeoJSON): RukunTetanggaGeoJSON {
  const parsedFeatures = geoJSON.features.map((feature) => {
    const coordinates = feature.geometry.coordinates[0].map(([x, y]) => {
      const coords = transform([x, y], 'EPSG:3857', 'EPSG:4326');

      return [coords[1], coords[0]];
    }) as Array<[number, number]>;

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

const batchSize = 5;

// Fetch GeoJSON objects from the URLs and store them in an array
export async function fetchAndCombineGeoJSONs(): Promise<
  Record<string, RukunTetanggaGeoJSON>
> {
  const parsedGeoJsons: RukunTetanggaGeoJSON[] = [];

  const uniqueUrls = Array.from(new Set(urls));
  const numberOfUrls = uniqueUrls.length;
  // numberOfUrls = 1;

  for (let i = 0; i <= numberOfUrls; i += batchSize) {
    const batchUrls = uniqueUrls.slice(i, i + batchSize);
    const geoJsons = await Promise.all(batchUrls.map(fetchGeoJSON));
    const parsedBatchGeoJsons = geoJsons
      .filter((item) => item.features)
      .map(parseGeoJSON);
    parsedGeoJsons.push(...parsedBatchGeoJsons);
  }

  // Sort the fetched objects based on their `translate` values
  // parsedGeoJsons.sort((a, b) => {
  //   const [ax, ay] = a.transform.translate;
  //   const [bx, by] = b.transform.translate;

  //   if (ay !== by) {
  //     return ay - by;
  //   }
  //   return ax - bx;
  // });

  const result = {} as Record<string, RukunTetanggaGeoJSON>;

  parsedGeoJsons.forEach((item) => {
    const [x, y] = item.transform.translate;

    result[`key-${x}-${y}-${Math.random().toFixed(5)}`] = item;
  });

  saveToFile(result);

  return result;
}

// Usage example
// fetchAndCombineGeoJSONs()
//   .then((combinedGeoJSON) => {
//     console.log(combinedGeoJSON);
//   })
//   .catch((error) => {
//     console.error('Failed to fetch and combine GeoJSONs:', error);
// });
