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

// Fetch GeoJSON objects from the URLs and store them in an array
export async function fetchAndCombineGeoJSONs(): Promise<RukunTetanggaGeoJSON> {
  const geoJsons = await Promise.all(urls.map(fetchGeoJSON));

  // Sort the fetched objects based on their `translate` values
  geoJsons.sort((a, b) => {
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
    crs: geoJsons[0].crs,
    transform: geoJsons[0].transform,
    features: ([] as RukunTetanggaFeature[]).concat(
      ...geoJsons.map((g) => g.features)
    )
  };

  return combinedGeoJSON;
}

// Usage example
fetchAndCombineGeoJSONs(urls)
  .then((combinedGeoJSON) => {
    console.log(combinedGeoJSON);
  })
  .catch((error) => {
    console.error('Failed to fetch and combine GeoJSONs:', error);
  });
